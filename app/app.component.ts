import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'my-app',
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="search" class="form-control">
    <form>
  `
})
export class AppComponent { 

    form: FormGroup;

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            search: []
        });

        var search = this.form.controls['search'];
        search.valueChanges
          .debounceTime(400)
          .map(str => (<string>str).replace(' ', '-'))
          .subscribe(x => console.log(x));

        //this.createObservableDate();
        //this.createTimer();
        //this.createParallels();
        //this.createError();
        //this.retry();
        //this.catch();
        //this.timeout();
        this.completed();
    }

    createObservableDate() {
        var startDates = [];
        var startDate = new Date();

        for (var day = -2; day <= 2; day++) {
            var date = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate() + day);

            startDates.push(date);
        }

        Observable
          .from(startDates)
          .map(date => {
              console.log("Getting deals for date " + date)
              return [1, 2, 3];
          })
          .subscribe(x => console.log(x));
    }

    createTimer() {
        var observable = Observable.interval(1000);
        observable.subscribe(x => console.log(x));
    }

    createParallels() {
        var userStream = Observable.of({ userId: 1, username: 'mosh' }).delay(2000);
        var tweetsStream = Observable.of([1, 2, 3]).delay(1500);

        Observable
          .forkJoin(userStream, tweetsStream)
          .map(joined => new Object({ user: joined[0], tweets: joined[1] }))
          .subscribe(x => console.log(x));
    }

    createError() {
        var observable = Observable.throw(new Error("Something failed."));
        observable.subscribe(x => console.log(x), error => console.log(error));
    }

    retry() {
        var counter = 0;

        var ajaxCall = Observable.of('url')
          .flatMap(() => {
              if (++counter < 2) {
                  return Observable.throw(new Error("Request failed"));
              }

              return Observable.of([1, 2, 3]);
          });

        ajaxCall
          .retry(3)
          .subscribe(x => console.log(x), error => console.log(error));
    }

    catch() {
        var remoteDataStream = Observable.throw(new Error("Something failed"));

        remoteDataStream
          .catch(err => {
              var localDataStream = Observable.of([1, 2, 3]);
              return localDataStream;
          })
          .subscribe(x => console.log(x));
    }

    timeout() {
        var remoteDataStream = Observable.of([1, 2, 3]).delay(5000);

        remoteDataStream
          .timeout(1000)
          .subscribe(
            x => console.log(x), 
            error => console.log(error));
    }

    completed() {
        var remoteDataStream = Observable.of([1, 2, 3]).delay(5000);

        remoteDataStream
          .subscribe(
            x => console.log(x), 
            error => console.log(error),
            () => console.log("completed"));
    }
}
