angular.module(
    'de.cismet.crisma.widgets.scenarioListWidgetWirecloud',
    [
        'de.cismet.crisma.widgets.scenarioListWidget',
        'de.cismet.crisma.widgets.shared'
    ]
).run(
    [
        '$rootScope',
        '$q',
        'de.cismet.crisma.widgets.shared.SharedService',
        'de.cismet.crisma.widgets.scenarioListWidget.services.ScenarioWorldstatesService',
        'DEBUG',
        function ($rootScope, $q, SharedService, wsService, DEBUG) {
            'use strict';

            var mashupPlatform, setSelectedWSWirecloud;

            if (typeof MashupPlatform === 'undefined') {
                if (DEBUG) {
                    console.log('mashup platform not available');
                }
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;

                $rootScope.$on('selectedWorldstatesChanged', function () {
                    var i, selWsArray, selWsStringArray, stringifiedArray;

                    selWsArray = SharedService.getSelectedWorldstates();

                    if (DEBUG) {
                        console.log('BEGIN: pushing selected worldstates event: ' + selWsArray);
                    }

                    selWsStringArray = [];

                    if (selWsArray) {
                        for (i = 0; i < selWsArray.length; ++i) {
                            selWsStringArray.push(selWsArray[i].id);
                        }
                    }

                    stringifiedArray = JSON.stringify(selWsStringArray);

                    if (DEBUG) {
                        console.log('DO: pushing selected worldstates event: ' + stringifiedArray);
                    }

                    mashupPlatform.wiring.pushEvent('getSelectedWorldstates', stringifiedArray);

                    if (DEBUG) {
                        console.log('DONE: pushing selected worldstates event: ' + stringifiedArray);
                    }
                });

                setSelectedWSWirecloud = function (newSelWsStringArray) {
                    var i, resolve, setArray, selWsStringArray;

                    if (DEBUG) {
                        console.log('BEGIN: receiving selected worldstates event: ' + newSelWsStringArray);
                    }

                    setArray = function (arr) {
                        if (DEBUG) {
                            console.log('DO: receiving selected worldstates event: ' + arr);
                        }

                        SharedService.setSelectedWorldstates(arr);

                        if (DEBUG) {
                            console.log('DONE: receiving selected worldstates event: ' + arr);
                        }
                    };

                    if (newSelWsStringArray) {
                        try {
                            selWsStringArray = JSON.parse(newSelWsStringArray);

                            if ($.isArray(selWsStringArray)) {
                                resolve = [];

                                for (i = 0; i < selWsStringArray.length; ++i) {
                                    resolve[i] = wsService.getScenarioWorldstates().get({wsId: selWsStringArray[i]})
                                        .$promise;
                                }

                                $q.all(resolve).then(function (selWsArray) {
                                    setArray(selWsArray);
                                });
                            } else {
                                if (DEBUG) {
                                    console.log('not an array: ' + selWsStringArray);
                                }
                                setArray([]);
                            }
                        } catch (e) {
                            if (DEBUG) {
                                console.log(e);
                            }
                            setArray([]);
                        }
                    } else {
                        setArray([]);
                    }
                };

                mashupPlatform.wiring.registerCallback('setSelectedWorldstates', setSelectedWSWirecloud);
            }
        }
    ]
).config(
    [
        '$provide',
        function ($provide) {
            'use strict';

            var mashupPlatform;


            if (typeof MashupPlatform === 'undefined') {
                console.log('mashup platform not available');

                $provide.constant('DEBUG', 'true');
                $provide.constant('CRISMA_DOMAIN', 'CRISMA');
                $provide.constant('CRISMA_ICMM_API', 'http://crisma.cismet.de/icmm_api');
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;
                $provide.constant('DEBUG', mashupPlatform.prefs.get('DEBUG'));
                $provide.constant('CRISMA_DOMAIN', mashupPlatform.prefs.get('CRISMA_DOMAIN'));
                $provide.constant('CRISMA_ICMM_API', mashupPlatform.prefs.get('CRISMA_ICMM_API'));
            }
        }
    ]
);
