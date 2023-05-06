jquery-ui-nodeEditor
====================

Node Editor widget for jQuery-UI.

A node editor looks like a block diagram or flow chart editor, except the blocks can actually do things.  It is not simply a diagram for documentation purposes, but a working machine.

Each node represents a certain function.  It has a set of inputs, a set of outputs, and usually some user editable properties.  The user can drag the nodes they need into the diagram space, and connect them.  Data that is input to the graph will be modified by the nodes, and eventually produce some output.

This widget will be usable by a developer who wants to deploy a node editor to web page or web app.  The developer will define all the types and functions of nodes. The user can then build node graphs to do what they want.

Note:
------------
This widget is in very early stages, and is not even close to being ready for use.

The plan:
---------
This project seeks to create a node editor similar to what you see in Blender, or Quartz Composer, as a jQuery UI widget.

The widget should allow the developer to:
  * Handle arbitrary types of data passing through the nodes
  * Define several different node types, their inputs/outputs, and the actual functions that are applied to the data.
  * Define custom properties that affect the functionality of each node
  * Allow custom views for the node (for example an image processing node that shows the resulting image at that point in the graph).
  * Allow code to verify the input data and properties and present error messages to the end-user if the node is being used incorrectly.

The widget allows the end-user to:
  * Drag nodes around in a 2D space.
  * Connect nodes by dragging lines between I/O ports on nodes.
  * Preview results at various points in the graph (assuming this makes sense for that data).


![Screenshot of editor demo(https:///jquery-ui-node-editor.png)]