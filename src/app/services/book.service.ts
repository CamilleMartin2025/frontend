import { Injectable } from '@angular/core';
import { Book, Review } from '../models/book.model';

// TODO : link with Livre - Revue BDD
@Injectable({ providedIn: 'root' })
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'Don Quichotte',
      author: 'Cervantes',
      cover: 'https://m.media-amazon.com/images/I/81JdvvNqhfL.jpg',
      description:
        "Don Quichotte, un hidalgo espagnol passionné de romans de chevalerie, décide de se transformer en chevalier errant et part à l'aventure avec son fidèle écuyer Sancho Panza. Ensemble, ils vivent des aventures burlesques où la réalité et la fiction se mêlent dans un chef-d'œuvre de la littérature mondiale.",
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: true,
    },
    {
      id: 2,
      title: 'Alice au pays des merveilles',
      author: 'Lewis Carroll',
      cover: 'https://m.media-amazon.com/images/I/81gSEGpEHkL.jpg',
      description:
        "Alice suit un lapin blanc dans un terrier et se retrouve dans un monde fantastique peuplé de créatures extraordinaires. Le Chapelier Fou, la Reine de Cœur, le Chat du Cheshire... une plongée dans l'absurde et la poésie qui n'a cessé de fasciner petits et grands depuis 1865.",
      genre: ['Classique', 'Fantaisie'],
      rating: 5,
      available: true,
    },
    {
      id: 3,
      title: "Les aventures d'Huckleberry Finn",
      author: 'Mark Twain',
      cover: 'https://m.media-amazon.com/images/I/71wATxyBsRL.jpg',
      description:
        "Huck Finn s'échappe de chez son père violent et descend le Mississippi sur un radeau avec Jim, un esclave en fuite. Un roman d'aventure et d'initiation qui dresse un portrait sans concession de l'Amérique d'avant-guerre, considéré comme l'un des premiers grands romans américains.",
      genre: ['Classique', 'Aventure'],
      rating: 4,
      available: false,
    },
    {
      id: 4,
      title: 'Facile',
      author: 'Magnus Nabo',
      cover: 'https://m.media-amazon.com/images/I/71q7PpG0mvL.jpg',
      description:
        'Un guide pratique et décalé pour apprendre à naviguer dans la vie avec humour et légèreté. Magnus Nabo démonte les idées reçues sur le succès et propose une vision rafraîchissante du quotidien, entre développement personnel et comédie.',
      genre: ['Développement personnel', 'Humour'],
      rating: 5,
      available: true,
    },
    {
      id: 5,
      title: "L'intruse",
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description:
        "Quand une inconnue s'installe dans la vie d'une famille, les apparences commencent à se fissurer. Un thriller psychologique haletant où chaque révélation remet en question tout ce qu'on croyait savoir. Freida McFadden maîtrise l'art du retournement de situation.",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 6,
      title: "D'autres printemps",
      author: 'Virginie Grimaldi',
      cover: 'https://m.media-amazon.com/images/I/71kJFgNWeiL.jpg',
      description:
        'Lorsque Lily, sa mère et sa grand-mère se retrouvent à partager le même toit, trois générations de femmes doivent apprendre à se redécouvrir. Un roman tendre et lumineux sur le temps qui passe, les secrets de famille et la force des liens du sang.',
      genre: ['Roman', 'Contemporain'],
      rating: 5,
      available: false,
    },
    {
      id: 7,
      title: 'La Prof',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/81hqUOLSqEL.jpg',
      description:
        "Chaque matin, Eve et son mari, Nate, partent ensemble au lycée où elle enseigne les mathématiques et lui l'anglais. Une vie parfaite, réglée comme du papier à musique.\n\nPourtant, l'établissement a récemment été secoué par un scandale. Un professeur a été licencié parce qu'il aurait eu une liaison avec l'une de ses élèves, Addie. Et cette année, elle se retrouve dans la classe d'Eve et dans celle de son charmant mari.\n\nComme tout le monde, Eve sait que l'on ne peut pas faire confiance à la jeune fille. Mais quand la prof commence à comprendre qui est véritablement Addie, il est peut-être déjà trop tard...",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 8,
      title: "L'Autre moi",
      author: 'Franck Thilliez',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description:
        'Un homme se réveille sans souvenir de qui il est. En cherchant à reconstituer son identité, il découvre une vérité terrifiante sur lui-même. Franck Thilliez signe un thriller psychologique qui brouille les frontières entre mémoire, identité et réalité.',
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 9,
      title: "L'élégance de la manipulation",
      author: 'Marwan Mery',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description:
        "Comment influencer sans dominer, convaincre sans contraindre ? Marwan Mery explore les mécanismes de la persuasion bienveillante et livre des outils concrets pour mieux communiquer, négocier et s'affirmer dans toutes les sphères de la vie.",
      genre: ['Développement personnel'],
      rating: 3,
      available: false,
    },
    {
      id: 10,
      title: 'La locataire',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71C0B+NPoxL.jpg',
      description:
        "Millie accepte un poste d'aide à domicile chez une famille en apparence parfaite. Mais très vite, elle réalise qu'elle ne peut pas partir — et que ses employeurs cachent un secret bien gardé. Un huis-clos suffocant signé Freida McFadden.",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: true,
    },
    {
      id: 11,
      title: 'Le boyfriend',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71pHE5XTWIL.jpg',
      description:
        "Sydney cherche l'amour par le biais des applis de rencontre, mais ses petits amis ont une fâcheuse tendance à mourir. Est-elle malchanceuse ou dangereuse ? Un thriller addictif qui joue habilement avec les codes du genre.",
      genre: ['Policier', 'Thriller'],
      rating: 4,
      available: false,
    },
    {
      id: 12,
      title: 'La psy',
      author: 'Freida McFadden',
      cover: 'https://m.media-amazon.com/images/I/71Oc0xS6bQL.jpg',
      description:
        "La Dre Eva Hawthorn est psychiatre dans un établissement pénitentiaire. Quand elle commence à douter de la culpabilité d'un de ses patients condamné pour meurtre, sa propre vie bascule. Un thriller à suspense intense qui questionne la vérité et la justice.",
      genre: ['Policier', 'Thriller'],
      rating: 5,
      available: true,
    },
    {
      id: 13,
      title: "L'Étranger",
      author: 'Albert Camus',
      cover: 'https://m.media-amazon.com/images/I/41pFLMkOqhL.jpg',
      description:
        "Meursault, un Algérois ordinaire, apprend la mort de sa mère sans émotion apparente. Quelques jours plus tard, sur une plage, il tue un Arabe. Lors de son procès, c'est son indifférence qui sera jugée autant que son crime. Un roman fulgurant sur l'absurde et la condition humaine.",
      genre: ['Classique', 'Philosophie'],
      rating: 5,
      available: false,
    },
    {
      id: 14,
      title: 'Dune',
      author: 'Frank Herbert',
      cover: 'https://m.media-amazon.com/images/I/81ym3QUd3KL.jpg',
      description:
        "Sur la planète désertique Arrakis, seule source de l'Épice, la substance la plus précieuse de l'univers, le jeune Paul Atréides va devoir affronter la trahison, la guerre et son propre destin. Une fresque de science-fiction monumentale, considérée comme l'une des plus grandes œuvres du genre.",
      genre: ['Science-fiction', 'Aventure'],
      rating: 5,
      available: false,
    },
    {
      id: 15,
      title: '1984',
      author: 'George Orwell',
      cover: 'https://m.media-amazon.com/images/I/71kxa2iBsNL.jpg',
      description:
        "Dans un futur totalitaire, Winston Smith travaille au ministère de la Vérité où il réécrit l'histoire selon les directives du Parti. Sa rencontre avec Julia et un membre supposé de la résistance va l'entraîner dans une dangereuse quête de liberté. Le roman dystopique de référence.",
      genre: ['Classique', 'Dystopie'],
      rating: 5,
      available: true,
    },
    {
      id: 16,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      cover: 'https://m.media-amazon.com/images/I/81q6G5ZQWEL.jpg',
      description:
        "Un aviateur en panne dans le désert du Sahara rencontre un mystérieux petit prince venu d'une autre planète. À travers ses voyages et ses rencontres, le petit prince pose un regard lucide et poétique sur le monde des adultes. Le livre le plus traduit après la Bible.",
      genre: ['Classique', 'Philosophie'],
      rating: 5,
      available: true,
    },
    {
      id: 17,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      cover: 'https://m.media-amazon.com/images/I/71Z7kpw7yJL.jpg',
      description:
        "Comment l'Homo sapiens est-il devenu le maître incontesté de la planète ? De la révolution cognitive à la révolution scientifique en passant par l'agriculture et les empires, Yuval Noah Harari retrace l'histoire de l'humanité avec une clarté et une audace intellectuelle rares.",
      genre: ['Histoire', 'Essai'],
      rating: 4,
      available: true,
    },
    {
      id: 18,
      title: 'Le nom de la rose',
      author: 'Umberto Eco',
      cover: 'https://m.media-amazon.com/images/I/81r3wlFcRmL.jpg',
      description:
        "En 1327, le moine Guillaume de Baskerville et son novice Adso arrivent dans une abbaye bénédictine où plusieurs moines sont retrouvés morts dans des circonstances mystérieuses. Une enquête médiévale érudite et captivante, mêlant polar, philosophie et histoire de l'Église.",
      genre: ['Policier', 'Histoire'],
      rating: 4,
      available: false,
    },
  ];

  private reviews: Record<number, Review[]> = {
    7: [
      {
        id: 1,
        title: 'Impossible à poser !',
        body: "Un thriller haletant du début à la fin. Les rebondissements s'enchaînent et on ne voit pas venir la fin.",
        reviewerName: 'Sophie M.',
        date: new Date('2026-03-15'),
        rating: 5,
      },
      {
        id: 2,
        title: 'Très bien mais prévisible',
        body: "L'écriture est fluide et l'ambiance bien installée, mais j'ai deviné la fin assez tôt. Lecture agréable.",
        reviewerName: 'Thomas R.',
        date: new Date('2026-02-28'),
        rating: 3,
      },
      {
        id: 3,
        title: 'Un coup de cœur !',
        body: "Je l'ai dévoré en une nuit. Le personnage d'Addie est fascinant, on ne sait jamais ce qu'elle pense vraiment.",
        reviewerName: 'Camille L.',
        date: new Date('2026-02-10'),
        rating: 5,
      },
    ],
    14: [
      {
        id: 1,
        title: 'Une épopée inoubliable',
        body: 'Dune est une œuvre totale — politique, écologie, religion, tout y est traité avec une profondeur rare.',
        reviewerName: 'Marc D.',
        date: new Date('2026-04-01'),
        rating: 5,
      },
      {
        id: 2,
        title: 'Long mais valeur sûre',
        body: "Le début est dense et demande un effort, mais une fois embarqué on ne peut plus s'arrêter. Un classique mérite.",
        reviewerName: 'Lucie P.',
        date: new Date('2026-03-10'),
        rating: 4,
      },
    ],
    15: [
      {
        id: 1,
        title: 'Glaçant et actuel',
        body: 'Relire 1984 en 2026 donne le frisson. Orwell avait tout prévu. Un roman indispensable.',
        reviewerName: 'Antoine V.',
        date: new Date('2026-04-20'),
        rating: 5,
      },
      {
        id: 2,
        title: "Un chef-d'œuvre",
        body: 'La langue est simple, le propos vertigineux. Big Brother est partout et nulle part. Brillant.',
        reviewerName: 'Inès K.',
        date: new Date('2026-03-05'),
        rating: 5,
      },
    ],
  };

  getAll(): Book[] {
    return this.books;
  }

  getById(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  getReviews(bookId: number): Review[] {
    return this.reviews[bookId] ?? [];
  }

  // Livres du même auteur (hors livre courant)
  getByAuthor(author: string, excludeId: number): Book[] {
    return this.books.filter((b) => b.author === author && b.id !== excludeId);
  }

  // Livres du même genre (hors livre courant)
  getSimilar(book: Book): Book[] {
    return this.books
      .filter((b) => b.id !== book.id && b.genre.some((g) => book.genre.includes(g)))
      .slice(0, 3);
  }
}
