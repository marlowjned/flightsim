#include <iostream>

enum COORDINATE_SYSTEM {
    GLOBAL,
    ROCKET
};

struct Force {
    std::array<float, 3> components;
    COORDINATE_SYSTEM coordSystem;
    
    Force() : components(0.0f, 0.0f, 0.0f), coordSystem(GLOBAL) {}
    
    Force(float x, float y, float z)
            : components{x, y, z}, coordSystem(TRUE) {}
    
    Force(float x, float y, float z, COORDINATE_SYSTEM cs)
            : components{x, y, z}, coordSystem(cs) {}
    
};

class FlightSim {
    float dt = 0.05;
    Rocket rocket;
    
    struct FlightSnapshot {
        
    };
    
    class FlightData {
        std::vector<FlightSnapshot> flightData;
        
        // add data
        
    };
    
    
    // evaluateForces
    void evaluateForces(FlightSnapshot& state, CoeffData& coeffs) {
        // Fd = 0.5 * A * Cd * rho * v^2
        // Fn = q * A * Cn
        // Ft = thrust curve
        
        // return net force?
        
    }
    
    void run() {
        
    }
    
};



// contains basic data about rocket
class Rocket {
    float hollowMass;
    Engine engine;
    
    
    
};


class RasData {
    // initialized using csv file
    // functions for accessing interpolated coeffs
    
    class CoeffData { // maybe struct instead
        // given the full ras constructed interpolators, make rocket specfic coeffs
        
    };
    
};

class WindData {
    
};

int main() {
    std::cout << "Hello World!";
    
    return 0;
    
}
