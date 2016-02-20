/**
 * Stats
 */
define(["Stats","container"], function (Stats, container) {

    'use strict';

	// // STATS
    var stats = new Stats();

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0';

    container.appendChild( stats.domElement );

    return stats;
});