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

var _apiDir = __dirname + "./../../../../ext/invoke/",
    _libDir = __dirname + "./../../../../lib/",
    _extDir = __dirname + "./../../../../ext/",
    mockedInvocation,
    index,
    successCB,
    failCB,
    errorCode = -1;

xdescribe("invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            invoke: jasmine.createSpy("invocation.invoke"),
            queryTargets: jasmine.createSpy("invocation.queryTargets"),
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };

        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        index = null;
        successCB = null;
        failCB = null;
    });

    xdescribe("invoke", function () {

        it("can invoke with target", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({target: "abc.xyz"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                target: "abc.xyz"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });

        it("can invoke with uri", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    xdescribe("query", function () {
        var APPLICATION = 1,
            CARD = 2,
            VIEWER = 4;

        it("can query the invocation framework", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for application targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for viewer targets", function  () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = VIEWER;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for card targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });


        xit("can perform a query for all targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not remove target_type if it is invalid", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["ONE", "TWO", "THREE"],
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not modify the request if the target_type has no valid values", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["ONE", "TWO", "THREE"],
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not modify the request object if the target type and target type mask exist", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"],
                    "target_type_mask": VIEWER
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not modify the request object if the target_type is not an array", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "APPLICATION"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });
    });

    describe("card", function () {
        beforeEach(function () {
            mockedInvocation.closeChildCard = jasmine.createSpy("invocation.closeChildCard");
        });

        afterEach(function () {
            delete mockedInvocation.closeChildCard;
        });

        describe("methods", function () {
            it("can call closeChildCard with success callback at the end", function () {
                index.closeChildCard(successCB, failCB);
                expect(mockedInvocation.closeChildCard).toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
                expect(failCB).not.toHaveBeenCalled();
            });

            it("can call closeChildCard with fail callback on wrong call", function () {
                index.closeChildCard(null, failCB);
                expect(mockedInvocation.closeChildCard).toHaveBeenCalled();
                expect(successCB).not.toHaveBeenCalled();
                expect(failCB).toHaveBeenCalledWith(errorCode, jasmine.any(Object));
            });
        });

        describe("events", function () {
            var utils,
                events,
                eventExt;

            beforeEach(function () {
                utils = require(_libDir + "utils");
                events = require(_libDir + "event");
                eventExt = require(__dirname + "./../../../../ext/event/index");
                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });
            });

            afterEach(function () {
                utils = null;
                events = null;
                eventExt = null;
            });

            it("can register for events", function () {
                var evts = ["onChildCardStartPeek", "onChildCardEndPeek", "onChildCardClosed"],
                    args;

                spyOn(events, "add");

                evts.forEach(function (e) {
                    args = {eventName : encodeURIComponent(e)};
                    index.registerEvents(successCB);
                    eventExt.add(null, null, args);
                    expect(successCB).toHaveBeenCalled();
                    expect(events.add).toHaveBeenCalled();
                    expect(events.add.mostRecentCall.args[0].event).toEqual(e);
                    expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
                });
            });

            it("call successCB when all went well", function () {
                var eventName = "onChildCardClosed",
                    args = {eventName: encodeURIComponent(eventName)};

                spyOn(events, "add");
                index.registerEvents(jasmine.createSpy(), jasmine.createSpy());
                eventExt.add(successCB, failCB, args);
                expect(events.add).toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
                expect(failCB).not.toHaveBeenCalled();
            });

            it("call errorCB when there was an error", function () {
                var eventName = "onChildCardClosed",
                    args = {eventName: encodeURIComponent(eventName)};

                spyOn(events, "add").andCallFake(function () {
                    throw "";
                });

                index.registerEvents(jasmine.createSpy(), jasmine.createSpy());
                eventExt.add(successCB, failCB, args);
                expect(events.add).toHaveBeenCalled();
                expect(successCB).not.toHaveBeenCalled();
                expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
            });

            it("can un-register from events", function () {
                var evts = ["onChildCardStartPeek", "onChildCardEndPeek", "onChildCardClosed"],
                    args;

                spyOn(events, "remove");

                evts.forEach(function (e) {
                    args = {eventName : encodeURIComponent(e)};
                    eventExt.remove(null, null, args);
                    expect(events.remove).toHaveBeenCalled();
                    expect(events.remove.mostRecentCall.args[0].event).toEqual(e);
                    expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
                });
            });

            it("call successCB when all went well even when event is not defined", function () {
                var eventName = "eventnotdefined",
                    args = {eventName: encodeURIComponent(eventName)};

                spyOn(events, "remove");
                eventExt.remove(successCB, failCB, args);
                expect(events.remove).toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
                expect(failCB).not.toHaveBeenCalled();
            });

            it("call errorCB when there was exception occured", function () {
                var eventName = "onChildCardClosed",
                    args = {eventName: encodeURIComponent(eventName)};

                spyOn(events, "remove").andCallFake(function () {
                    throw "";
                });

                eventExt.remove(successCB, failCB, args);
                expect(events.remove).toHaveBeenCalled();
                expect(successCB).not.toHaveBeenCalled();
                expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
            });
        });
    });
});
