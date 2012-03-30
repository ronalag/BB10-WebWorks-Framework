describe("blackberry.event", function() {
   var ppsUtils = require("../../lib/pps/ppsUtils"),
       LOW_THRESHOLD,
       CRITICAL_THRESHOLD,       
       TIMEOUT = 500;
   
   ppsUtils.init();

   function setBatteryLevel(level) {
      var ctrlObj = {
         'id': "",
         'dat' : "StateOfCharge::" + level,
         'msg' : ""
      };
      ppsUtils.open("/pps/services/power/battery?wait,delta", 2);
      ppsUtils.write(ctrlObj);
   }

   function setBatteryCharge(isPlugged) {
      var ctrlObj = {
         'id': "",
         /* Not sure about the DC value*/
         'dat' : "ChargingState::" + (isPlugged ? "DC" : "NC") ,
         'msg' : ""
      };
      ppsUtile.open("/pps/services/power/charger?wait,delta", 2);
      ppsUtils.write(ctrlObj);
   }

   it("should be defined", function () {
      expect(blackberry.event).toBeDefined();
   });

   describe("addEventListener", function() {

      function onBatteryStatusChange(level, isPlugged) {}
      function onBatteryCritical(level, isPlugged) {}
      function onBatteryLow(leve, isPlugged) {}

      describe("batterystatus", function() {
         
         beforeEach(function () {

            /* Set battery level to 100*/
            setBatteryLevel(100);
            /* Set charge to false*/
            setBatteryCharged(false);
         });

         afterEach(function () {
            blackberry.event.removeEventListener("batterystatus", onBatteryStatusChange);
            blackberry.event.removeEventListener("batterycritical", onBatteryCritical);
            blackberry.event.removeEventListener("batterylow", onBatteryLow);
         });

         it("should be called when the battery level changes", function() {

            blackberry.event.addEventListener("batterystatus", onBatteryStatusChange);

            /* Change battery level to 90*/
            setBatteryLevel(90); 

            waits(TIMEOUT);
            expect(onBatteryStatusChanged).toHaveBeenCalledWith(90, false);
         });

         it("should be called when the device starts to receive a charge", function () {
            
            blackberry.event.addEventListener("batterystatus", onBatteryStatusChange);
            
            /* Start a charge*/
            setBatterCharge(true); 

            waits(TIMEOUT);
            expect(onBatteryStatusChanged).toHaveBeenCalledWith(100, true);
         });

         it("should be called when the device stops receiving a charge", function () {
            
            /* Set battery status to charge */
            setBatteryCharge(true);

            blackberry.event.addEventListener("batterystatus", onBatteryStatusChange);
            
            /* Stop the charge */
            setBatteryCharge(false);
             
            waits(TIMEOUT);
            expect(onBatteryStatusChanged).toHaveBeenCalledWith(100, false);
         });
      });
      
      describe("batterylow", function () {
         
         it("should be called when the battery level reaches the low threshhold", function () {

            blackberry.event.addEventListener("batterylow", onBatteryLow);
            
            /* Set battery level below low threshold*/
            setBatteryLevel(LOW_THRESHOLD - 1);

            waits(TIMEOUT);
            expect(onBatteryLow).toHaveBeenCalledWith(100, false);
         });
      });

      describe("batterycritical", function () {
         
         it("should be called when the battery level reaches the critical threshold", function () {
            
            blackberry.event.addEventListener("batterycritical", onBatteryCritical);

            /* Set battery level below the critical threshold*/
            setBatteryLevel(CRITICAL_THRESHOLD - 1);

            waits(TIMEOUT);
            expect(onBatteryCritical).toHaveBeenCalledWith(100, false);
         });
      });
   });

   describe("removeEventListener", function () [
      
      beforeEach(function () {
         blackberry.event.addEventListener("batterystatus", onBatteryStatusChange);
         blackberry.event.addEventListener("batterylow", onBatteryLow);
         blackberry.event.addEventListener("batterycritical", onBatteryCritical);
      });

      afterEach(function () {
         blackberry.event.removeEventListener("batterystatus", onBatteryStatusChange);
         blackberry.event.removeEventListener("batterylow", onBatteryLow);
         blackberry.event.removeEventListener("batterycritical", onBatteryCritical);
      });
      
      it("should remove a listener attached to the batterystatus event", function  () {
         blackberry.event.removeEventListener("batterystatus", onBatteryStatusChange);
         
         /* Change the battery level*/
         setBatteryLevel(90);

         waits(TIMEOUT);
         expect(onBatteryStatusChanged).not.toHaveBeenCalled();
      });

      it("should remove a listener attached to the batterylow event", function () {
         blackberry.event.removeEventListener("batterylow", onBatteryLow);

         /* Set the battery level to below the low threshold*/
         setBatteryLevel(LOW_THRESHOLD - 1);

         waits(TIMEOUT);
         expect(onBatteryLow).not.toHaveBeenCalled();
      });

      it("should remove a listener attached to the batterycritical event", function () {
         blackberry.event.removeEventListener("batterycritical", onBatteryCritical);

         /* Set the battery level below the critical threshold*/
         setBatteryLevel(CRITICAL_THRESHOLD - 1);

         waits(TIMEOUT);
         expect(onBatteryCritical).not.toHaveBeenCalled();
      });
   });

   ppsUtils.close();

});
