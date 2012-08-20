// Copyright 2012 - Malcolm Dwyer
// Distributed under MIT license
// http://opensource.org/licenses/mit-license.php/

$(document).ready(function() {
    console.log("Starting basic example for jquery.ui.nodeEditor.js");

    $('<div></div>')
        .addClass('nodeEditor')
        .appendTo('body')
        .nodeEditor({
            nodes: [
                {
                    label: '5',
                    outputs: [
                        {
                            label: 'Output',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.notify(5);
                                return d.promise;
                            }
                        }
                    ]
                },
                {
                    label: '8',
                    outputs: [
                        {
                            label: 'Output',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.notify(8);
                                return d.promise;
                            }
                        }
                    ]
                },
                {
                    label: '+',
                    inputs: [
                        {
                            id: 'A',
                            label: 'A'
                        },
                        {
                            id: 'B',
                            label: 'B'
                        }
                    ],
                    outputs: [
                        {
                            label: 'Output',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.resolve(parseInt(inputs.A + inputs.B));
                                return d.promise;
                            }
                        }
                    ]
                }
            ]
        });
});
