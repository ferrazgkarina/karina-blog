// Strings de UI (menus, labels, botões) centralizadas para não precisar caçar
// texto espalhado pelos componentes quando um segundo locale for adicionado.
// Conteúdo de post (título, teaser, corpo) NÃO mora aqui — isso vem do Sanity
// e é localizável por documento, não por string de UI.
export const languages = {
  en: 'English',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.explore': 'Explore',
    'nav.blog': 'Blog',
    'nav.bookYourTrip': 'Book Your Trip',
    'nav.contact': 'Contact',
    'nav.openMenuAriaLabel': 'Open menu',
    'nav.closeMenuAriaLabel': 'Close menu',
    'breadcrumb.ariaLabel': 'Breadcrumb',
    'breadcrumb.home': 'Home',
    'byline.writtenBy': 'Written by',
    'byline.updated': 'Updated',
    'inThisPost.heading': 'In This Post',
    'goodToKnow.defaultTitle': 'Good to know',
    'goodToKnow.jumpDefault': 'In a rush? Jump to the quick facts',
    'goodToKnow.ratingAriaLabel': '{rating} out of 5',
    'goodToKnow.opensInNewTab': '(opens in a new tab)',
    'share.label': 'Share',
    'share.onNetwork': 'Share on',
    'relatedContent.heading': 'Keep Reading',
    'suggestedPosts.heading': 'Suggested for you',
    'sidebar.ariaLabel': 'Sidebar',
    'sidebar.bookmarkAriaLabel': 'Bookmark this post',
    'comingNext.prefix': 'Coming next:',
    'comingNext.endOfPost': "You've reached the end of the post",
    'comingNext.endOfPostMobile': 'Keep planning your trip: Tap + for related posts',
    'comingNext.toggleAriaLabel': 'Show related content and share options',
    'comingNext.closeAriaLabel': 'Close',
    'home.latestPosts': 'Latest posts',
    'home.faqHeading': 'Common questions',
    'home.faqLink': 'View the full FAQ',
    'carousel.prev': 'Previous posts',
    'carousel.next': 'Next posts',
    'footer.privacyPolicy': 'Privacy Policy',
    'blog.searchPlaceholder': 'Search posts…',
    'blog.searchAriaLabel': 'Search posts',
    'blog.allCategories': 'All',
    'blog.noResults': 'No posts match your search.',
    'home.seeAllPosts': 'See all posts',
  },
} as const;
