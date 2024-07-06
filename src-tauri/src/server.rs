use std::io::{prelude::*, BufReader, Write};
use std::net::TcpListener;
use std::{
    sync::{Arc, Mutex},
    thread,
};

use serde::{Deserialize, Serialize};

use crate::radio::RadioParams;
use crate::telem::Telem;

#[derive(Deserialize, Serialize)]
struct Body {
    port: String,
}

pub fn server(telem_mutex: &Arc<Mutex<Telem>>, radio_params_mutex: &Arc<Mutex<RadioParams>>) {
    let telem_clone = Arc::clone(&telem_mutex);
    let radio_params_clone = Arc::clone(&radio_params_mutex);
    thread::spawn(move || {
        let listener = TcpListener::bind("127.0.0.1:5000").unwrap();

        'hey: loop {
            for stream in listener.incoming() {
                let mut stream = stream.unwrap();

                let buf_reader = BufReader::new(&mut stream);
                // let mut prev_line = "".to_string();
                let mut st = false;
                let mut second = false;
                let _http_request: Vec<String> = buf_reader
                    .lines()
                    .map(|result| match result {
                        Ok(res) => res,
                        Err(_) => "".to_string(),
                    })
                    .take_while(|line| {
                        if *line == "POST /setport HTTP/1.1".to_string() {
                            st = true;

                            // println!("st {}", st);
                        }

                        if line.is_empty() && st == true && second == false {
                            second = true;
                            // println!("second {}", second);
                            return true;
                        }

                        if line.is_empty() && st == true && second == true {
                            // println!("is empty {}", second);
                            return false;
                        }

                        !line.is_empty()
                    })
                    .collect();

                let mut telem = telem_clone.lock().unwrap();
                let mut radio_params = radio_params_clone.lock().unwrap();

                if _http_request.len() > 0 {
                    if _http_request[0] == "POST /setport HTTP/1.1" {
                        let st: Body =
                            serde_json::from_str(_http_request[_http_request.len() - 1].as_str())
                                .unwrap();
                        // println!("{:?}", st.port);
                        radio_params.port_name = st.port;
                    }
                }

                let inner_telem: &mut Telem = &mut *telem;
                let inner_radio: &mut RadioParams = &mut *radio_params;

                let json_telem = serde_json::to_string(inner_telem).unwrap();
                let json_radio = serde_json::to_string(inner_radio).unwrap();

                let response = format!(
                "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nContent-Type: application/json\r\n\r\n[{},{}]",
                json_telem.len() + json_radio.len() + 3,
                json_telem,
                json_radio
            );

                drop(telem);
                drop(radio_params);

                match stream.write_all(response.as_bytes()) {
                    Ok(_) => {}
                    Err(_) => {
                        continue 'hey;
                    }
                }
            }
        }
    });
}
