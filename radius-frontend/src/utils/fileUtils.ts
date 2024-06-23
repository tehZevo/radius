
export async function fileToBase64(file)
{
  return new Promise((res, rej) =>
  {
    var reader = new FileReader()

    reader.onload = function()
    {
      res(reader.result.split(',')[1]) //remove mime type, just keep b64
    }
    
    reader.onerror = function(error)
    {
      rej(error)
    }

    reader.readAsDataURL(file)
   })
}