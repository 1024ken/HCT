import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, Content } from 'ionic-angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Questionnaire } from '../../providers/questionnaire';
import { QuestionItem } from '../../providers/questionnaire';

@IonicPage()
@Component({
  selector: 'page-assessment',
  templateUrl: 'assessment.html',
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        animate('0.5s ease', keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 1, offset: 1.0 })
        ]))
      ])
    ])
  ]
})

export class AssessmentPage {
  @ViewChild(Content) content: Content;

  public status: string;

  private waitingAnswer: boolean;

  constructor(
    public viewCtrl: ViewController,
    public questionnaire: Questionnaire
  ) {
    if (!this.questionnaire.IsFinished) {
      this.status = "answer";
      this.questionnaire.init();  
    } else {
      this.status = "result1";
    }
    this.waitingAnswer = false;
  }

  get CurrentQuestion() {
    return this.questionnaire.CurrentQuestion;
  }

  get CurrentQuestionIndex() {
    return this.questionnaire.CurrentQuestionIndex;
  }

  get Questions() {
    return this.questionnaire.Questions;
  }

  get AnswerCount() {
    let num = '' + this.questionnaire.AnswerCount;
    return ('00' + num).slice(-2);
  }

  get QuestionItemCount() {
    let num = '' + this.questionnaire.QuestionItemCount;
    return ('00' + num).slice(-2);
  }

  get Progress() {
    return this.questionnaire.Progress;
  }

  get IsQuestionFinished() {
    return this.CurrentQuestion.IsFinished;
  }

  get IsFinished() {
    return this.questionnaire.IsFinished;
  }

  get IsPHQ9() {
    return this.CurrentQuestionIndex == this.questionnaire.PHQ9_INDEX;
  }

  get SCPoint() {
    return this.questionnaire.SCPoint;
  }

  get SMPoint() {
    return this.questionnaire.SMPoint;
  }

  get BAPoint() {
    return this.questionnaire.BAPoint;
  }

  get CRPoint() {
    return this.questionnaire.CRPoint;
  }

  get ATPoint() {
    return this.questionnaire.ATPoint;
  }

  get PSPoint() {
    return this.questionnaire.PSPoint;
  }

  get SCIsDanger() {
    return (this.questionnaire.SCPoint >= 10);
  }

  get SCIsWarning() {
    return (10 > this.questionnaire.SCPoint && this.questionnaire.SCPoint >= 5);
  }

  get SCIsHealth() {
    return (5 > this.questionnaire.SCPoint);
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {
  }

  ionViewDidLeave() {
  }

  //選択肢に対するチェック箇所//
  answer(item: QuestionItem, value: number, last: boolean) {
    if (this.waitingAnswer) {
      return;
    }

    this.questionnaire.answer(item, value);

    if (last) {
      this.waitingAnswer = true;

      setTimeout(function() {
        if (!this.questionnaire.nextItem()) {
          this.waitingAnswer = false;
        }
        setTimeout(function() {
          this.content.resize();
          this.content.scrollToBottom(500);
        }.bind(this), 100);
      }.bind(this), 500);
    }
  }

  itemFadeInDone() {
    this.waitingAnswer = false;
  }

  nextQuestion() {
    this.questionnaire.nextQuestion();
    setTimeout(function() {
      this.content.resize();
      this.content.scrollToTop();  
    }.bind(this), 100);
  }

  prevQuestion() {
    this.questionnaire.prevQuestion();
    setTimeout(function() {
      this.content.resize();
      this.content.scrollToTop();  
    }.bind(this), 100);
  }

  showPHQ9() {
    this.questionnaire.complete();
    this.status = "result1";
    this.content.resize();
  }

  showSkill() {
    this.status = "result2";
    this.content.resize();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
