# Usage

Download the repository and edit the js/autocompleteBSDemo.js file and put in a URL that can be used by the FETCH command.

The service at that URL will receive a GET call with parameter 'term' and should return JSON with minimim tags of {"id" , "value"}, the object returned can be more complex and the selected result can be handled in your resultHandleBS function as shown in the demo.

Once I have time I will make the demo more self contained.