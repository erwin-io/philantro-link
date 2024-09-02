import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'censored'
})
export class CensoredStringPipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    if(!value || value === undefined || value === null) {
      value = '';
    }
    const regex = /(?!^)[\s\S](?!$)/g;

    const censored = value?.trim().split(' ').map(x=> {
      if(x.length > 4) {
          return x.substring(0,1) + x.slice(1).replace(regex, '*');
      } else if(x.length === 4) {
          return x.substring(0,1) + '***';
      } else if(x.length === 3) {
          return x.substring(0,1) + '**';
      } else if(x.length === 2) {
          return x.substring(0,1) + '*';
      } else {
          return x.replace(regex, '*');
      }
    }).join(' ');
    return censored;
  }


}
