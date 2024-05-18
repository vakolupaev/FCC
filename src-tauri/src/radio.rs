use crate::telem::Telem;
use core::time;
use std::{
    io, ptr,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RadioParams {
    _ports: Vec<String>,
    _bauds: Vec<u32>,
    is_connected: bool,
    pub port_name: String,
    baud_rate: u32,
}

impl RadioParams {
    pub fn new() -> RadioParams {
        return RadioParams {
            _ports: [].to_vec(),
            _bauds: [].to_vec(),
            is_connected: false,
            port_name: " ".to_string(),
            baud_rate: 460800,
        };
    }
}

pub fn radio(
    radio_params_mutex: &Arc<Mutex<RadioParams>>,
    channels_mutex: &Arc<Mutex<[u16; 16]>>,
    telem_mutex: &Arc<Mutex<Telem>>,
) {
    let radio_params_clone = Arc::clone(radio_params_mutex);
    let channels_clone = Arc::clone(channels_mutex);
    let telem_clone = Arc::clone(telem_mutex);

    thread::spawn(move || {
        println!("Radio module not connected");
        loop {
            match serialport::available_ports() {
                Ok(ports) => {
                    match radio_params_clone.lock() {
                        Ok(mut radio_params) => {
                            radio_params._ports = [].to_vec();
                            for i in &ports {
                                // println!("{}", i.port_name);
                                radio_params._ports.push(i.port_name.clone());
                            }
                            let continue_after = radio_params.port_name == " ".to_string();
                            drop(radio_params);
                            if continue_after {
                                thread::sleep(time::Duration::from_secs(1));
                                continue;
                            }
                        }
                        Err(_) => {
                            continue;
                        }
                    };
                }
                Err(_e) => {
                    continue;
                }
            }

            let radio_params = radio_params_clone.lock().unwrap();

            let port = serialport::new(&radio_params.port_name, radio_params.baud_rate)
                .timeout(Duration::from_millis(10))
                .open();

            let port_name = radio_params.port_name.clone();
            drop(radio_params);

            match port {
                Ok(mut port) => unsafe {
                    println!("Radio module connected");
                    let mut received_buf: Vec<u8> = vec![0; 32];

                    let mut radio_params = radio_params_clone.lock().unwrap();
                    radio_params.is_connected = true;
                    drop(radio_params);

                    loop {
                        let radio_params = radio_params_clone.lock().unwrap();

                        if radio_params.port_name != port_name {
                            break;
                        }
                        drop(radio_params);

                        match port.read(received_buf.as_mut_slice()) {
                            Ok(_t) => {
                                let body = received_buf.align_to::<Telem>().1;

                                let body = &body[0];

                                let b = ptr::read(body);
                                let mut telem = telem_clone.lock().unwrap();

                                *telem = b;
                                drop(telem);
                            }
                            Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
                            Err(_e) => {
                                break;
                            }
                        }

                        let channels = channels_clone.lock().unwrap().to_vec();
                        let u8arr: &[u8] = &channels.align_to::<u8>().1;
                        match port.write(&u8arr) {
                            Ok(_) => {}
                            Err(_e) => {
                                break;
                            }
                        }
                        drop(channels);
                    }

                    continue;
                },
                Err(_) => {
                    let mut radio_params = radio_params_clone.lock().unwrap();
                    radio_params.is_connected = false;
                    println!("Radio module not connected");
                    drop(radio_params);
                    thread::sleep(time::Duration::from_secs(1));
                    drop(port);
                }
            }
        }
    });
}
