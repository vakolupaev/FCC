use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Telem {
    type_of_message: u32,
    ground_speed: f32,
    pitch: f32,
    yaw: f32,
    roll: f32,
    lat: i32,
    lon: i32,
    alt: i32,
}

impl Telem {
    pub fn new() -> Telem {
        return Telem {
            type_of_message: 0,
            ground_speed: 0.0,
            pitch: 0.0,
            yaw: 0.0,
            roll: 0.0,
            lat: 0,
            lon: 0,
            alt: 0,
        };
    }
}
