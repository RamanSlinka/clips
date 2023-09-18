import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ClipService} from "../../srevices/clip.service";
import IClip from "../../models/clip.model";
import {ModalService} from "../../srevices/modal.service";
import {update} from "@angular/fire/database";
import {BehaviorSubject, elementAt} from "rxjs";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  public videoOrder = '1';
  public clips: IClip[] = [];
  public activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>

  constructor(private router: Router,
              private route: ActivatedRoute,
              private clipService: ClipService,
              private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
      this.sort$.next(this.videoOrder)
    })

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    const {value} = (event.target as HTMLSelectElement)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()

    this.activeClip = clip;

    this.modal.toggleModal('editClip')
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == $event.docID) {
        this.clips[index].title = $event.title
      }
    })
  };

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    this.clipService.deleteClip(clip)

    this.clips.forEach((element, index) => {
      if(element.docID == clip.docID) {
        this.clips.splice(index, 1)
      }
    })
  }
}
