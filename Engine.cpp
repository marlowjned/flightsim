#include <iostream>

// get lookup tables

// make different ways to define engine
public class Engine {
    float wetMass; // need cg positions as well
    float dryMass;
    
    // thrust curve
    public class Fuel {
        float Volume;
        float initP;
        float pLoss;
        
        public void update(float MFR);
        
    };
    
    class Oxidizer {
        float Volume;
        float initP;
        float pLoss;
        
        public void update(float MFR);
        
    };
    
    class Thrust {
        
        
    };
    
    
};


