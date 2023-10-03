import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import IClip from "../models/clip.model";
import {DatePipe} from "@angular/common";

// import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {

  @ViewChild('videoPlayer', {static: true}) target?: ElementRef
  public clip?: IClip
  public src: any

  // player: videojs.Player;
  constructor(public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // this.player = videojs(this.target?.nativeElement)

    this.route.data.subscribe(data => {
      this.clip = data['clip'] as IClip


      // this.player?.src({
      //   src: this.clip.url,
      //   type: 'video/mp4'
      // })

      this.src = this.clip.url


    })

  }

}
