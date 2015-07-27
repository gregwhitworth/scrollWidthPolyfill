Overview
==================
This was created purely for polyfilling scrollWidth() for inputs, no other types of elements. On most sites the perf hit (which is about an additional 6ms per input) should be fine and will hopefully apply pressure to the MS Edge team to fix this bug but allow you to utilize Lea Verou's [Stretchy Library](http://leaverou.github.io/stretchy/)

#### Do not use this if you are using ScrollWidth for anything other than inputs

Since I am making this only to polyfill `scrollWidth` for inputs, if you utilize scrollWidth for anything else, do not use this polyfill!

Which Browsers Need This?
------------------
Currently only IE and MS Edge need this polyfill, possibly Safari if padding isn't included (I haven't tested this). A bug has been opened against MS Edge to have this fixed.

Usage
------------------
It's pretty straight forward, just include the JS file on your site near `</body>` then call:

    var el = document.getElementById("testInput");
    var scrollWidth = el.scrollWidth // element == the element you want the scroll width of
	
Please submit bugs
------------------
If you find any bugs in this please let me know by opening an issue. Additionally I currently only have tests for `<textarea>` and `<input type="text">`. If there is desire for more I will add them depending on complexity.

License
------------------
This is released under the [MIT License](http://opensource.org/licenses/MIT)