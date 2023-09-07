import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { app } from './firebase-setup';

const db = getDatabase(app);
const storage = getStorage(app);

export async function getBrandsForUser(userId) {
	const brandsRaw = {
		1: {
			id: '1',
			name: 'Grisso',
		},
		11: {
			id: '11',
			name: 'Grisso & lifi',
		},
	};
	return Object.values(brandsRaw);
}

export async function getAppsForBrand(brandId) {
	const apps = [
		{
			authorId: '1',
			description:
				'Shooting to aplikacja symulująca strzelanie z broni. Użytkownik posiada do wyboru: Pistolet Shotgun Karabin maszynowy i wiele więcej. Sprawdź sam !',
			id: '1',
			name: 'Shooting',
			version: '1.0',
		},
		{
			authorId: '1',
			description:
				'Już dziś poczuj się jak rycerz Jedi. Dostosuj styl walki do własnego urządzenia. Ponadto użytkownik posiada do wyboru aż 6 kolorów miecza świetlnego.',
			id: '2',
			name: 'Lightsaber',
			version: '1.0',
		},
		{
			authorId: '1',
			description:
				'Shooting Game łączy technologie z fantastyczną zabawą na świeżym powietrzu. Tak zwana popularna zabawa w strzał podbiła serca fanów. Zagraj już dziś!',
			id: '3',
			name: 'Shooting Game',
			version: '1.2',
		},
		{
			authorId: '1',
			description:
				'School Book to rewelacyjne narzędzie dla wszystkich uczniów i studentów. Profesjonalny plan lekcji, intuicyjny kalendarz i szybki notatnik.',
			id: '4',
			name: 'School book',
			version: '1.2',
		},
		{
			authorId: '1',
			description:
				'Nie musisz już udawać zombie swoim własnym głosem. Aplikacja zrobi to za ciebie. Wysokie możliwości konfiguracji zadowolą każdego gracza.',
			id: '5',
			name: 'Zombie Game',
			version: '1.0',
		},
		{
			authorId: '1',
			description:
				'Gra zręcznościowa dla osób szukających prawdziwych wyzwań. Każdy poziom został specjalnie zaprojektowany pod względem logicznym. Fantastyczna grafika uprzyjemni Twój czas. Pytanie czy akceptujesz wyzwanie?',
			id: '6',
			name: 'Portal Escape',
			version: '1.3',
		},
		{
			authorId: '20',
			description:
				'Dzięki użyciu najnowszych technologii już dziś możesz sprawdzić jak dane słowo należy pisać od tyłu. Nie wierzysz? Pobierz już dziś!',
			id: '7',
			name: 'Reverse',
			version: '1.0',
		},
		{
			authorId: '11',
			description:
				'Już dziś stań się farmerem. Dbaj o kurę, handluj na targowisku, okradaj sąsiadów. I to wszystko we wspaniałej oprawie graficznej i dźwiękowej.',
			id: '8',
			name: 'Clicker',
			version: '1.2',
		},
		{
			authorId: '1',
			description:
				'Prosta aplikacja do zapisywania wyników gry w rzutki. Potrafi nazwać poszczególnych graczy i sumować wyniki gry.',
			id: '9',
			name: 'Darts',
			version: '1.0',
		},
		{
			authorId: '1',
			changelog:
				'- Nowy tryb "Wojna gangów"\n- Wsparcie do 6 botów w nowym trybie\n- Wprowadzono czat do komunikacji\n- Nowe frakcje: Tezcas, Synowie Ragnaroku oraz Chłopcy Cioci Shu\n- Dodano możliwość ustawienia rozmiaru list\n- Ogólne poprawki i ulepszania',
			description:
				'Gra multiplayer w uniwersum Watch_Dogs. Zagraj jako haker z Dedsec i ścigaj się z Prime_Eight o dane z serwerów Umeni. Sprowadzaj na siebie lokalne gangi w ich walce o terytorium.',
			id: '10',
			name: 'DEDSEC Ops',
			version: '2.0',
		},
		{
			authorId: '1',
			description:
				'Kreator konfiguracji dla map do DEDSEC Ops. Już dziś utwórz swoją własną mapę. Powodzenia!',
			id: '11',
			name: 'DEDSEC Forge',
			version: '1.2',
		},
		{
			authorId: '1',
			changelog: '- kontynuacja eventu (III tura wyborów)',
			description:
				'A gdyby tak rzucić wszystko i... zostać farmerem? Tak, kontynuacja legendarnego Clickera powraca. Po raz pierwszy gra pozwoli Ci: posiadać nowe zwierzęta, zbierać nowe surowce i przedmioty, rozmawiać z przyjaciółmi i dbać o reputacje.',
			id: '12',
			name: 'Clicker 2',
			version: '1.9.2',
		},
		{
			authorId: '1',
			description: 'Dzięki tej aplikacji możesz spisać wszystkie swoje pomysły.',
			id: '13',
			name: 'Spiser',
			version: '1.0',
		},
		{
			authorId: '20',
			changelog:
				'- added support for multiple shopping lists\n\n- moved update dialog to the home screen. update check triggers automatically every time the home screen is opened. You can now also open download link in the browser automatically (without having to copy it etc)',
			description:
				'Znasz to uczucie gdy wracasz ze sklepu i uświadamiasz sobie że zapomniałeś/aś czegoś kupić?\n\nNigdy więcej! Dzięki aplikacji Lista Zakupów możesz założyć i współdzielić z innymi osobami listy zakupów.',
			id: '14',
			lastUpdated: 1659261600000,
			name: 'Lista Zakupów',
			version: '1.4.0',
		},
	];
	apps.forEach(
		(app) =>
			(app.logoUrl =
				'https://firebasestorage.googleapis.com/v0/b/family-store.appspot.com/o/Family%20Store%202%2FApps%2F1%2Flogo.png?alt=media&token=20125344-f624-46da-8961-38e6442ff29d')
	);
	apps.reverse();
	return apps.filter((app) => app.authorId === brandId);
}
