import { Injectable } from '@angular/core';

export class MasterQuestion {
  description: string;
  pointLabels: string[];
  masterItems: MasterQuestionItem[];
}

export class MasterQuestionItem {
  category: string;
  negative: boolean;
  content: string;
}

export class Question extends MasterQuestion {
  items: QuestionItem[];

  constructor(master:MasterQuestion) {
    super();
    this.description = master.description;
    this.pointLabels = master.pointLabels;
    this.masterItems = master.masterItems;
    this.items = [];
  }

  next(): boolean {
    if (this.items.length < this.masterItems.length) {
      let item = new QuestionItem(this, this.masterItems[this.items.length]);
      this.items.push(item);
      return true;
    }
    return false;
  }

  get IsFinished(): boolean {
    if (this.items.length < this.masterItems.length) {
      return false;
    }
    return this.items[this.items.length-1].isAnswered;
  }
}

export class QuestionItem extends MasterQuestionItem {
  parent: Question;
  point: number;

  constructor(parent:Question, master:MasterQuestionItem) {
    super();
    this.category = master.category;
    this.negative = master.negative;
    this.content = master.content;
    this.parent = parent;
    this.point = -1;
  }

  get isAnswered() {
    return (this.point != -1);
  }

  get pointLabel() {
    if (this.point == -1) {
      return "";
    }
    return this.parent.pointLabels[this.point];
  }

  get PointString() {
    return this.point.toString(10);
  }
}

@Injectable()
export class Questionnaire {

  public readonly PHQ9_INDEX = 0;
  public readonly Q1_INDICES = [1, 2];
  private readonly MAX_POINT = 3;
  private readonly masters: MasterQuestion[] = [
    {
      description: "<u>今日を含めた過去1週間</u>、次のような問題にどのくらい頻繁（ひんぱん）に悩まされていますか？「全くない」「数日」「半分以上」「ほとんど毎日」の4つの選択肢の中から選んで下さい。",
      pointLabels: [
        "全くない",
        "数日",
        "半分以上",
        "ほとんど毎日"
      ],
      masterItems: [
        { category: "SC", negative: false, content: "物事に対してほとんど興味がない、あるいは、楽しめない" },
        { category: "SC", negative: false, content: "気分が落ち込む、憂うつになる、あるいは、絶望的な気持ちになる" },
        { category: "SC", negative: false, content: "寝付きが悪い、あるいは、途中で目がさめる、あるいは、逆に眠り過ぎる" },
        { category: "SC", negative: false, content: "疲れた感じがする、あるいは、気力がない" },
        { category: "SC", negative: false, content: "あまり食欲がない、あるいは、食べ過ぎる" },
        { category: "SC", negative: false, content: "自分はダメな人間だ、人生の敗北者だと気に病む、あるいは、自分自身あるいは家族に申し訳がないと感じる" },
        { category: "SC", negative: false, content: "新聞を読む、または、テレビを見ることなどに集中することが難しい" },
        { category: "SC", negative: false, content: "他人が気づくぐらいに動きや話し方が遅くなる、あるいは、これと反対に、そわそわしたり、落ちつかず、ふだんよりも動き回ることがある" },
        { category: "SC", negative: false, content: "死んだ方がましだ、あるいは、自分を何らかの方法で傷つけようと思ったことがある" }
      ]
    },
    {
      description: "以下の文章を読んで、各項目が、<u>ふだんのあなた</u>にどれだけ当てはまるか答えて下さい。最も良く当てはまるものにチェックをつけて下さい。あまり深く考えずにお答えください。",
      pointLabels: [
        "ほとんど当てはまらない",
        "あまり当てはまらない",
        "やや当てはまる",
        "かなり当てはまる"
      ],
      masterItems: [
        { category: "AT", negative: false, content: "自分が不愉快な思いをさせられたときには、はっきりと苦情を言う" },
        { category: "AT", negative: false, content: "友だちが自分の気持ちを傷つけたら、そのことをはっきりと伝える" },
        { category: "AT", negative: false, content: "どんなに親しい人に頼まれても、やりたくないことははっきりと断る" },
        { category: "AT", negative: false, content: "人の話の内容が間違いだと思ったときには、自分の考えを述べるようにしている" },
        { category: "AT", negative: false, content: "どちらかといえば、自分の意見を気軽に言うほうだ" },
        { category: "AT", negative: false, content: "たとえ人から非難されたとしても、うまく片付けることができる" },
        { category: "AT", negative: false, content: "相手と意見が異なることをさりげなく示すことができる" },
        { category: "SM", negative: true,  content: "自分の行動と気持ちがどう関係しているのかわからないことがある" },
        { category: "SM", negative: true,  content: "自分の気持ちが今どうなのか分からなくてとまどうことが多い" },
        { category: "SM", negative: true,  content: "自分でも分からない気持ちがわいてくることが多い" },
        { category: "SM", negative: true,  content: "自分でもなんだかよく分からない身体の感じがある" },
        { category: "SM", negative: true,  content: "自分の体の調子がどうなっているのか分からないことの方が多い" },
        { category: "PS", negative: false, content: "何か問題があるときは、もうこれ以上アイデアが出てこないくらいまで、できるだけ多くの対処方法を考える" },
        { category: "PS", negative: true,  content: "問題に直面すると、その解決方法として最初に思いついたことをする傾向がある" },
        { category: "PS", negative: true,  content: "何か問題について考えや解決方法を決めるとき、時間をかけてそれぞれの選択肢ごとの成功の可能性を考えることはない" },
        { category: "PS", negative: false, content: "問題に直面したとき、次に何をすべきか決める前に立ち止まって考える" },
        { category: "PS", negative: false, content: "決定する際には、選択肢それぞれでどうなりそうかを考慮して、選択肢のあいだで比較する" },
        { category: "PS", negative: false, content: "問題が生じて混乱したときに私が最初にすることは、状況を調べてすべての重要な情報を考慮に入れることである" }
      ]
    },
    {
      description: "それぞれの質問をよく読み、今日を含めた<u>過去1週間</u>のあなたの状態にもっともよく当てはまるものにチェックをつけてください。",
      pointLabels: [
        "ほとんど当てはまらない",
        "あまり当てはまらない",
        "やや当てはまる",
        "かなり当てはまる"
      ],
      masterItems: [
        { category: "BA", negative: true, content: "しなければならないことで、していないことがいくらかあった" },
        { category: "BA", negative: false, content: "私は自分のしたことの量や種類に満足している" },
        { category: "BA", negative: false, content: "私は数多くのさまざまな活動を行った" },
        { category: "BA", negative: false, content: "私は自分がどのような活動をするか、どのような状況に身を置くかについて、良い判断をした" },
        { category: "BA", negative: false, content: "私は活動的で、自分が定めた目標を達成した" },
        { category: "BA", negative: true,  content: "私のしたことはほとんどが嫌なことから逃げることか、避けることだった" },
        { category: "BA", negative: true,  content: "私は嫌な気分から目を背けるような活動を行った" },
        { category: "BA", negative: false, content: "私は楽しいことをした" },
        { category: "CR", negative: false, content: "否定的な考えや気持ちのために苦しくなったときには、それに対処するためにできることの具体的な行動計画を考えた" },
        { category: "CR", negative: false, content: "何かで気持ちが動転したときは、自分が何を考えているかに注目して、もっとバランスの取れた見方をできるようにした" },
        { category: "CR", negative: false, content: "否定的な考えになっていることに気づいて、どこが否定的になってしまっているかを認識し、状況を再評価するようにした" },
        { category: "CR", negative: false, content: "自分が不合理な考え方になっていることにしばしば気づき、もっと合理的なものの見方をするように積極的に努力した" },
        { category: "CR", negative: false, content: "何か悪いことが起こって自分を責めたときは、ほかにも原因がなかったかを時間をかけて考えるようにした" },
        { category: "CR", negative: false, content: "気持ちが動転したときは、状況から一歩下がって、自分の否定的な考えが間違っているかどうかを検討した" }
      ]
    }
  ];

  questionItemCount: number;
  questions: Question[];
  answerCount: number;
  currentQuestionIndex: number;
  
  start: Date;
  end: Date;

  constructor() {
    this.questionItemCount = 0;
    this.masters.forEach(question => {
      this.questionItemCount += question.masterItems.length;
    });
  }

  get Questions(): Question[] {
    return this.questions;
  }

  get CurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get CurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  get QuestionItemCount(): number {
    return this.questionItemCount;
  }

  get AnswerCount(): number {
    return this.answerCount;
  }

  get Progress(): number {
    if (!this.questions) {
      return 0;
    }
    return Math.ceil(this.answerCount / this.questionItemCount * 100);
  }

  get IsFinished() {
    if (!this.questions || this.questions.length != this.masters.length) {
      return false;
    }
    return this.questions[this.questions.length-1].IsFinished;
  }

  get SCPoint() {
    return this.result('SC');
  }

  get SMPoint() {
    return this.result('SM');
  }

  get BAPoint() {
    return this.result('BA');
  }

  get CRPoint() {
    return this.result('CR');
  }

  get ATPoint() {
    return this.result('AT');
  }

  get PSPoint() {
    return this.result('PS');
  }

  get LastQuestionNumber() {
    return this.masters.length;
  }

  get Q1Answers() {
    return this.Q1_INDICES.reduce((value, index) => {
      return value.concat(this.questions[index].items);
    }, []).map(item => {
      return (!item.negative) ? item.point : this.MAX_POINT - item.point;
    });
  }

  get PHQ9Answers() {
    return this.questions[this.PHQ9_INDEX].items.map(item => {
      return (!item.negative) ? item.point : this.MAX_POINT - item.point;
    });
  }

  get ResponseTime() {
    if (!this.start || !this.end) {
      return 0;
    }
    return Math.floor((this.end.getTime() - this.start.getTime()) / 1000);
  }

  get ResultJson() {
    return {
      Q1Answers: this.Q1Answers,
      Q1SMPoint: this.SMPoint,
      Q1BAPoint: this.BAPoint,
      Q1CRPoint: this.CRPoint,
      Q1ATPoint: this.ATPoint,
      Q1PSPoint: this.PSPoint,
      PHQ9Answers: this.PHQ9Answers,
      PHQ9Point: this.SCPoint,
      responseTime: this.ResponseTime
    };
  }

  init() {
    this.questions = [];
    this.questions.push(new Question(this.masters[0]));
    this.answerCount = 0;
    this.currentQuestionIndex = 0;
    this.start = new Date();
    this.end = null;
    this.nextItem();
  }

  answer(item: QuestionItem, value: number) {
    if (!item.isAnswered) {
      this.answerCount++;
    }
    item.point = value;
  }

  nextItem(): boolean {
    let question = this.questions[this.questions.length-1];
    if (question.IsFinished) {
      return false;
    }
    return question.next();
  }

  nextQuestion(): boolean {
    if (this.currentQuestionIndex < this.masters.length) {
      this.currentQuestionIndex++;
    }

    if (this.questions.length < this.currentQuestionIndex + 1) {
      let question = new Question(this.masters[this.questions.length]);
      this.questions.push(question);
      this.nextItem();
      return true;
    }
    return false;
  }

  prevQuestion(): boolean {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  complete() {
    if (!this.end) {
      this.end = new Date();
    }
  }

  result(category: string) {
    let count: number = 0;

    this.questions.forEach(question => {
      question.items.forEach(item => {
        if (item.category == category) {
          if (!item.negative) {
            count += item.point;
          } else {
            count += this.MAX_POINT - item.point;
          }
        }
      });
    });
    return count;
  }
}