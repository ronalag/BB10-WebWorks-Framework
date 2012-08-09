/*
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _event = require("../../lib/event"),
    _actionMap = {
        onChildCardStartPeek: {
            context: require("./invocationEvents"),
            event: "onChildCardStartPeek",
            trigger: function (peekType) {
                _event.trigger("onChildCardStartPeek", peekType);
            }
        },
        onChildCardEndPeek: {
            context: require("./invocationEvents"),
            event: "onChildCardEndPeek",
            trigger: function () {
                _event.trigger("onChildCardEndPeek");
            }
        },
        onChildCardClosed: {
            context: require("./invocationEvents"),
            event: "onChildCardClosed",
            trigger: function (info) {
                _event.trigger("onChildCardClosed", info);
            }
        }
    };

module.exports = {
    invoke: function (success, fail, args) {
        // if request contains invalid args, the invocation framework will provide error in callback
        // no validation done here
        var request = JSON.parse(decodeURIComponent(args["request"])),
            callback = function (error) {
                _event.trigger("invoke.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().invocation.invoke(request, callback);
        success();
    },

    query: function (success, fail, args) {
        var request = JSON.parse(decodeURIComponent(args["request"])),
            callback = function (error, response) {
                _event.trigger("invoke.queryEventId", {"error": error, "response": response});
            },
            APPLICATION = 1,
            CARD = 2,
            VIEWER = 4,
            hasValidEntries = false;

        if (Array.isArray(request["target_type"]) && !request["target_type_mask"]) {

            request["target_type"].forEach(function (element) {
                switch (element)
                {
                case "APPLICATION":
                    request["target_type_mask"] |= APPLICATION;
                    hasValidEntries = true;
                    break;
                case "CARD":
                    request["target_type_mask"] |= CARD;
                    hasValidEntries = true;
                    break;
                case "VIEWER":
                    request["target_type_mask"] |= VIEWER;
                    hasValidEntries = true;
                    break;
                }
            });

            if (hasValidEntries) {
                delete request["target_type"];
            }
        }

        window.qnx.webplatform.getApplication().invocation.queryTargets(request, callback);
        success();
    },

    closeChildCard: function (success, fail) {
        try {
            window.qnx.webplatform.getApplication().invocation.closeChildCard();
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    registerEvents: function (success, fail, args, env) {
        try {
            var utils = require("./../../lib/utils"),
                eventExt = utils.loadExtensionModule("event", "index");

            eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    }

};

