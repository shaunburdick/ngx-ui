import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { NgxUIModule } from '../../src/index';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxUIModule, FormsModule, NgxDatatableModule],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private applicationRef: ApplicationRef) {
  }

  hmrOnDestroy(store) {
    let cmpLocation = this.applicationRef.components.map(cmp => cmp.location.nativeElement);

    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);

    // inject your AppStore and grab state then set it on store
    // let appState = this.AppStore.get()
    // Object.assign(store, appState)

    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    // anything you need done the component is removed
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
