function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.send(null);
    {
        var request = new XMLHttpRequest();
        request.open("GET", file, false);
        request.send(null);
        var returnValue = request.responseText;

        return returnValue.split('\n');
    }
}
