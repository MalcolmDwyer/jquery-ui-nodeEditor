jquery-ui-nodeEditor
====================

Node Editor widget for jQuery-UI

The plan:
---------
This project seeks to create a node editor similar to
what you see in Blender, or Quartz Composer, as a
generic jQuery UI widget.

The widget should allow the developer to:
  * Handle arbitrary types of data passing through the nodes
  * Define several different node types, their inputs/outputs, properties, and
    the actual functions that are applied to the data.
  * Define custom properties that affect the functionality of each node
  * Allow custom views for the node (for example an image
    processing node that shows the resulting image at that point in the
    graph).
  * Allow code to verify the input data and properties and present error
    messages to the end-user if the node is being used incorrectly.

The widget allows the end-user to:
  * Drag nodes around in a 2D space.
  * Connect nodes by dragging lines between I/O ports on nodes.
  * Preview results at various points in the graph
    (assuming this makes sense for that data).


