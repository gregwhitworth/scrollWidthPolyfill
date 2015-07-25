# scrollWidthPolyfill
Polyfill for scroll width

Overview
==================
This was created purely for polyfilling scrollWidth() for inputs, no other types of elements. On most sites the per hit (which is about an additional 2ms per input) should be fine.

Which Browsers Need This?
==================
Currently only IE and MS Edge need this polyfill, possibly Safari if padding isn't included (I haven't tested this). A bug has been opened against MS Edge to have this fixed.

Usage
==================
It's pretty straight forward, just include the JS file on your site and then call:

    polyScrollWidth.getScrollWidth(el) // el == the element you want the scroll width of
	
Please submit bugs
==================
If you find any bugs in this please let me know by openeing an issue.