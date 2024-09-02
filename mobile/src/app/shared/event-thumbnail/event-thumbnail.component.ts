/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertOptions } from '@ionic/core';
import { readAsBase64, base64ToBlob, getEventCardDefaultImage, getFileExtension, createDataURL } from '../utility/utility';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { EVENT_THUMBNAIL } from '../constant/image.constant';
import { Files } from 'src/app/model/files';

@Component({
  selector: 'app-event-thumbnail',
  templateUrl: './event-thumbnail.component.html',
  styleUrls: ['./event-thumbnail.component.scss'],
  host: {
    class: "event-thumbnail"
  }
})
export class EventThumbnailComponent implements OnInit {
  @Input() type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE";
  @Input() eventThumbnails: Files[] = [];
  @Input() openedPic: Files = this.eventThumbnails[0] as any;
  @Input() canDelete: boolean = false;
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
  }

  get eventThumbnailsToDisplay() {
    return this.eventThumbnails.filter(x=>!x.delete);
  }

  async onShowChangeProfilePicMenu(fileId, add = false) {
    try {
      const actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Camera',
            handler: async () => {
              const image = await Camera.getPhoto({
                quality: 70,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera, // Camera, Photos or Prompt!
              });
              if (image) {
                
                const data = await readAsBase64(image, this.platform.is('hybrid'));
                const mimeType = data.toString().match(/data:(.*?);base64/)?.[1] || '';
                const blob = await base64ToBlob(this.platform.is('hybrid') ? data : data.toString().split(',')[1] as any , this.platform.is('hybrid') ? `image/${image.format}` : mimeType);
                if(blob.size > 4 * 1024 * 1024) {
                  this.presentAlert({
                    header: 'Try Again!',
                    subHeader: 'There was an error when uploading your image, please try again!',
                    message: "Image size exceeds the limit of 4MB.",
                    cssClass: 'alert-danger',
                    buttons: ['OK'],
                  })
                } else {
                  const fileExtension = this.platform.is('hybrid') ? image.format : getFileExtension(data);
                  if(add) {
                    this.openedPic = new Files();
                    const nextId = this.eventThumbnails.length > 0 ? Number(this.eventThumbnails[this.eventThumbnails.length - 1].fileId) + 1 : 1;
                    this.openedPic.fileId = nextId.toString();
                    this.openedPic.fileName = `image.${fileExtension}`;
                    this.openedPic.url = this.platform.is('hybrid') ? createDataURL(data as any, fileExtension) : data as any;
                    this.openedPic.new = true;
                    this.openedPic.changed = true;
                    this.eventThumbnails.push(this.openedPic);
                  } else {
                    this.openedPic.fileName = `image.${fileExtension}`;
                    this.openedPic.url = data as any;
                    this.openedPic.changed = true;
                    if(this.eventThumbnails.some(x=>x.fileId === fileId)) {
                      this.eventThumbnails.find(x=>x.fileId === fileId).changed = true;
                      this.eventThumbnails.find(x=>x.fileId === fileId).fileName = this.openedPic.fileName;
                      this.eventThumbnails.find(x=>x.fileId === fileId).url = this.openedPic.url;
                      this.reOrderImages(fileId);
                    }
                  }
                }
              }
              actionSheet.dismiss();
            },
          },
          {
            text: 'Gallery',
            handler: async () => {
              const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos, // Camera, Photos or Prompt!
              });
              if (image) {
                const data = await readAsBase64(image, this.platform.is('hybrid'));
                const mimeType = data.toString().match(/data:(.*?);base64/)?.[1] || '';
                const blob = await base64ToBlob(this.platform.is('hybrid') ? data : data.toString().split(',')[1] as any , this.platform.is('hybrid') ? `image/${image.format}` : mimeType);
                if(blob.size > 4 * 1024 * 1024) {
                  this.presentAlert({
                    header: 'Try Again!',
                    subHeader: 'There was an error when uploading your image, please try again!',
                    message: "Image size exceeds the limit of 4MB.",
                    cssClass: 'alert-danger',
                    buttons: ['OK'],
                  })
                } else {
                  const fileExtension = this.platform.is('hybrid') ? image.format : getFileExtension(data);
                  if(add) {
                    this.openedPic = new Files();
                    const nextId = this.eventThumbnails.length > 0 ? Number(this.eventThumbnails[this.eventThumbnails.length - 1].fileId) + 1 : 1;
                    this.openedPic.fileId = nextId.toString();
                    this.openedPic.fileName = `image.${fileExtension}`;
                    this.openedPic.url = this.platform.is('hybrid') ? createDataURL(data as any, fileExtension) : data as any;
                    this.openedPic.new = true;
                    this.openedPic.changed = true;
                    this.eventThumbnails.push(this.openedPic);
                  } else {
                    this.openedPic.fileName = `image.${fileExtension}`;
                    this.openedPic.url = data as any;
                    this.openedPic.changed = true;
                    if(this.eventThumbnails.some(x=>x.fileId === fileId)) {
                      this.eventThumbnails.find(x=>x.fileId === fileId).changed = true;
                      this.eventThumbnails.find(x=>x.fileId === fileId).fileName = this.openedPic.fileName;
                      this.eventThumbnails.find(x=>x.fileId === fileId).url = this.openedPic.url;
                      this.reOrderImages(fileId);
                    }
                  }
                }
              }
              actionSheet.dismiss();
            },
          },
          {
            text: 'Cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when uploading your image, please try again!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  async onDelete(fileId) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Delete image?',
          handler: async () => {
            if(this.eventThumbnails.some(x=>x.fileId === fileId)) {
              this.eventThumbnails.find(x=>x.fileId === fileId).delete = true;
              this.eventThumbnails.find(x=>x.fileId === fileId).changed = true;
              if(this.eventThumbnails.filter(x=>!x.delete).length > 0) {
                this.openedPic = this.eventThumbnails.filter(x=>!x.delete)[0];
                this.reOrderImages(this.openedPic.fileId);
              } else {
                this.openedPic = null;
              }
            }
          },
        },
        {
          text: 'Cancel',
          cssClass: 'close dismiss cancel',
          handler: async () => {
            actionSheet.dismiss();
          },
        },
      ],
    });
    actionSheet.present();
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  reOrderImages(fileId) {
    // Find the index of the object with the specified property value
    const index = this.eventThumbnails.findIndex(x => x.fileId === fileId);
    
    if (index !== -1) { // Check if the item exists
      // Remove the object from its current position
      const [item] = this.eventThumbnails.splice(index, 1);
      // Add the object to the front of the array
      this.eventThumbnails.unshift(item);
    }
  }

  imageErrorHandler(event, type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") {
    event.target.src = getEventCardDefaultImage(type);
  }

}
