sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "aaic/cockpit/model/JSONModelExt",
    "sap/ui/Device"
],
    function (JSONModel, JSONModelExt, Device) {
        "use strict";

        return {

            createDeviceModel: function () {
                const oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createNavigationModel: function () {
                const oModel = new JSONModel(sap.ui.require.toUrl("aaic/cockpit/model/navigation.json"));
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createSettingsModel: function () {
                const oModel = new JSONModel(sap.ui.require.toUrl("aaic/cockpit/model/settings.json"));
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createJSONModel: function (mode = "TwoWay") {
                const oModel = new JSONModel();
                oModel.setDefaultBindingMode(mode);
                return oModel;
            },

            createJSONModelExt: function (mode = "TwoWay") {
                //const oModel = new JSONModelExt(sap.ui.require.toUrl("aaic/cockpit/model/apis.json"));
                const oModel = new JSONModelExt();
                oModel.setDefaultBindingMode(mode);
                return oModel;
            }

        };

    });