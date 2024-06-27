
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

export async function fileToText(file)
{
  return new Promise((res, rej) =>
  {
    var reader = new FileReader()

    reader.onload = function()
    {
      res(reader.result)
    }
    
    reader.onerror = function(error)
    {
      rej(error)
    }

    reader.readAsText(file)
   })
}

export async function fileToJson(file)
{
  return JSON.parse(await fileToText(file))
}