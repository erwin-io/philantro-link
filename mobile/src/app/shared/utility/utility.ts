import { Photo } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";

export const convertNotationToObject = (notation: string, nestedValue):any => {
    let object = {}
    let pointer = object;
    notation.split('.').map( (key, index, arr) => {
      pointer = (pointer[key] = (index == arr.length - 1? nestedValue: {}))
    });
    return object;
}

export const getDistance = (from: {lat: number, lng: number} | google.maps.LatLng, to: {lat: number, lng: number} | google.maps.LatLng) => {
  return google.maps.geometry.spherical.computeDistanceBetween(from, to);
}

export const readAsBase64 = async(photo: Photo, hybrid: boolean) => {
  if (hybrid) {
    const file = await Filesystem.readFile({
      path: photo.path,
    });

    return file.data;
  } else {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    return (await convertBlobToBase64(blob)) as string;

    // const base64 = (await convertBlobToBase64(blob)) as string;
    // return base64.split(',')[1];
  }
}

export const getFileExtension = (dataURL) => {
    // Split the Data URL on commas and take the first part (the metadata)
    const metadata = dataURL.split(',')[0];

    // Use a regular expression to extract the file extension
    const match = metadata.match(/data:image\/([a-zA-Z0-9-.+]+);base64/);

    if (match) {
        return match[1];
    } else {
        return null; // Return null if the extension is not found
    }
}

export const convertBlobToBase64 = async (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


export const base64ToBlob = async (base64: string, contentType: string): Promise<Blob> => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export const isBase64 = (str: string): boolean => {
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

export const createDataURL = (base64String, fileExtension) => {
  // Create the MIME type based on the file extension
  let mimeType = '';
  
  switch(fileExtension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
          mimeType = 'image/jpeg';
          break;
      case 'png':
          mimeType = 'image/png';
          break;
      case 'gif':
          mimeType = 'image/gif';
          break;
      case 'pdf':
          mimeType = 'application/pdf';
          break;
      case 'svg':
          mimeType = 'image/svg+xml';
          break;
      case 'webp':
          mimeType = 'image/webp';
          break;
      case 'bmp':
          mimeType = 'image/bmp';
          break;
      case 'txt':
          mimeType = 'text/plain';
          break;
      case 'html':
          mimeType = 'text/html';
          break;
      // Add more cases as needed for other file types
      default:
          mimeType = 'application/octet-stream'; // fallback MIME type
  }

  // Construct the data URL
  const dataURL = `data:${mimeType};base64,${base64String}`;

  return dataURL;
}


export const isBlob = (value: any): boolean => {
  return value instanceof Blob;
}

export const getPersonDefaultImage = (gender: "MALE" | "FEMALE") => {
  if(gender === "MALE") {
    return "../../../assets/img/person.png"
  } else if(gender === "FEMALE") {
    return "../../../assets/img/person-female.png"
  } else  {
    return "../../../assets/img/person.png"
  }
}

export const getEventCardDefaultImage = (type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") => {
  if(type === "CHARITY") {
    return "../../../assets/img/event-thumbnail.png";
  } else if(type === "VOLUNTEER") {
    return "../../../assets/img/event-thumbnail-3.png";
  } else if(type === "DONATION") {
    return "../../../assets/img/event-donation-thumbnail.png";
  } else if(type === "ASSISTANCE") {
    return "../../../assets/img/event-help-thumbnail.png";
  } else {
    return "../../../assets/img/event-thumbnail.png";
  }
}

