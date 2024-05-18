#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

use radio::RadioParams;
use telem::Telem;

mod enums;
mod radio;
mod rc;
mod server;
mod tauri;
mod telem;

fn main() {
    let telem_mutex = Arc::new(Mutex::new(Telem::new()));
    let channels_mutex: Arc<Mutex<[u16; 16]>> = Arc::new(Mutex::new([0; 16]));
    let radio_params_mutex = Arc::new(Mutex::new(RadioParams::new()));

    radio::radio(&radio_params_mutex, &channels_mutex, &telem_mutex);
    rc::rc(&channels_mutex);
    server::server(&telem_mutex, &radio_params_mutex);
    tauri::tauri();
}
