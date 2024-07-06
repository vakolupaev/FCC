use std::{
    sync::{Arc, Mutex},
    thread,
    time::{self},
};

use crate::enums::{ARMING, MODES};
//1 - yaw
//3 - roll
//4 - pitch
//9 - throttle

pub fn rc(channels_mutex: &Arc<Mutex<[u16; 16]>>) {
    let mut mode = MODES::_FBWA as u16;
    let mut arming: u16 = ARMING::_DISARM as u16;
    let channels_clone = Arc::clone(channels_mutex);

    thread::spawn(move || {
        let api = hidapi::HidApi::new().unwrap();
        // for device in api.devices() {
        //     println!("{:?}", device);
        // }

        // println!("Opening...");
        let (vid, pid) = (0x054C, 0x0CE6);

        loop {
            match api.open(vid, pid) {
                Ok(device) => {
                    println!("RC device connected");
                    let mut buf = [0u8; 12];
                    let mut ch5 = 8;
                    loop {
                        // let manufacturer = device.get_manufacturer_string().unwrap();
                        // let product = device.get_product_string().unwrap();
                        // println!("Product {:?} Device {:?}", manufacturer, product);
                        match device.read(&mut buf[..]) {
                            Ok(_res) => {
                                // println!("{:?}", buf);

                                if ch5 == 8 && buf[5] as u8 == 2 {
                                    if mode == MODES::_FBWA as u16 {
                                        mode = MODES::_RTL as u16;
                                        println!("RTL");
                                    } else {
                                        mode = MODES::_FBWA as u16;
                                        println!("FBWA");
                                    }
                                    // println!("next mode {:?}", buf[5] as u8);
                                }

                                if ch5 == 8 && buf[5] as u8 == 0 {
                                    if arming == ARMING::_DISARM as u16 {
                                        arming = ARMING::_ARM as u16;
                                        println!("ARM");
                                    } else {
                                        arming = ARMING::_DISARM as u16;
                                        println!("DISARM");
                                    }
                                    // println!("next mode {:?}", buf[5] as u8);
                                }

                                let mut channels = channels_clone.lock().unwrap();
                                *channels = [
                                    1500, 1500, 1000, 1500, mode, arming, 1000, 1000, 1000, 1000,
                                    1000, 1000, 1000, 1000, 1000, 1000,
                                ];

                                channels[0] = ((buf[3] as u32) * 1000 / 255) as u16 + 1000;
                                channels[1] = ((buf[4] as u32) * 1000 / 255) as u16 + 1000;
                                channels[2] = ((buf[9] as u32) * 1000 / 255) as u16 + 1000;
                                channels[3] = ((buf[1] as u32) * 1000 / 255) as u16 + 1000;
                                drop(channels);
                                ch5 = buf[5] as u8;
                            }
                            Err(_e) => {
                                break;
                            }
                        }
                    }
                }
                Err(_e) => {
                    println!("RC device not connected");
                    thread::sleep(time::Duration::from_secs(1));
                }
            }
        }
    });
}
