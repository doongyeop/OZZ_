# [1주차] 공통프로젝트

## 7/8(월)

- [노마드코더](https://nomadcoders.co/react-for-beginners/lobby) - React 기초 공부

* 프로젝트 생성

```
npx create-react-app my-app
cd my-app
npm start
```

- 프로젝트 생성시 에러가 발생한다면 최신 업데이트

`npm uninstall -g create-react-app`
`npm install -g create-react-app`

#### 기본 문법

1. state

```js
const [value, modifier_function] = React.useState();
```

- 반환값으로 array를 준다.
- useState(초기값);을 줄 수 있다.
- setValue로 현재 상태값을 불러와서 상태를 변화할 수 있다.
- 버튼을 누를 때마다(=상태가 변할때마다) 모든 컴포넌트가 리렌더링 된다.

2. props

```js
function Button({ text }) { //props
  return <button>{text}</button>;
}

export default Button; //App.js에서 가져올 수 있다.


//App.js
import Button from "./Button";

function App() {
  return (
    <div>
      <h1>Welcome back!</h1>
      <Button text={"Continue"} />
    </div>
  );
}

export default App;

```

- 자식 컴포넌트로 객체(object)를 전달
- 전달할 prop의 타입을 지정하려면

`npm i prop-types`

```js
import propTypes from "prop-types";

function Button({ text }) {
  //props
  return <button className={styles.btn}>{text}</button>;
}

Button.prototype = {
  text: propTypes.string.isRequired,
};
```

3. CSS를 적용시키는 방법

- css 파일 생성 후 index.js에 import하기 -> 전체 컴포넌트에 적용됨
- style prop 사용 -> inline으로 적용

```js
<button
    style={{
    backgroundColor: "tomato",
    color: "white",
    }}
>
```

- css 모듈

ex) Button.module.css 파일 생성

```css
.btn {
  color: white;
  background-color: tomato;
}
```

Button.js에 import하기

```js
import styles from "./Button.module.css";

function Button({ text }) {
  //props
  return <button className={styles.btn}>{text}</button>;
}
```

→ class name은 렌더링하면 랜덤한 이름이 부여된다.
때문에 각 모듈이 같은 클래스명을 가지고 있어도 중복 문제가 생기지 않는다

## 7/9(화)

- [노마드코더](https://nomadcoders.co/react-for-beginners/lobby) - React 기초 공부

#### 기본 문법

1. useEffect

- 컴포넌트가 처음 render할 때 실행되고 다시는 실행되지 않을 함수를 넣는다.
  - 모든 함수는 컴포넌트가 처음 실행될때 렌더링된다. (즉, 한번은 다 실행됨)
- keyword의 상태값이 변할때마다 해당 코드를 실행, []는 감시할 (watch)상태값을 넣는다. 빈칸이면 그냥 한번만 실행

```js
useEffect(() => {
  if (keyword !== "" && keyword.length > 5) {
    console.log("SEARCH FOR : ", keyword);
  }
}, [keyword]);
```

[state1, state2] : 해당 상태값중 하나라도 변하면 실행

- 이벤트 설정

  ```tsx
  function App() {
    const [keyword, setKeyword] = useState("");
    const onChange = (event) => {
      setKeyword(event.target.value);
    };
    return <input value={keyword} onChange={onChange} type="text" />;
  }
  ```

  - onChange가 발생할때 event를 받게 된다. event는 text값을 갖고 있다.
    - 입력할 때마다 state가 변경되므로 계속 렌더 된다
    - 다른 상태값이 변화될때도 영향을 끼친다.
    - 이 때 useEffect함수안에 선언해서 한번만 렌더되도록 한다.

2. [Router](https://reactrouter.com/en/6.24.1/start/overview)

- `npm i react-router-dom@5.3.0` 기준

  - 현재 6.24.1까지 버전이 있음. 5버전과 6버전에 차이가 있으니 주의
      <aside>
      💡 1. Switch컴포넌트가 Routes컴포넌트로 대체되었습니다.
      
      Switch -> Routes
      
      2. Route컴포넌트 사이에 자식 컴포넌트를 넣지 않고, element prop에 자식 컴포넌트를 할당하도록 바뀌었습니다.
      
      Route path="/" element={< Home / >}
      
      </aside>

- BrowserRouter : URL이 보통의 웹사이트(ex. localhost:0000/movie) ← 대부분 이거

  ```tsx
  import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
  import Detail from "./routes/Detail";
  import Home from "./routes/Home";

  return (
    <Router>
      <Switch>
        <Route path="/hello">
          <h1>Hello</h1>
        </Route>
        <Route path="/movie">
          <Detail />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
  ```

  - Router : router 컴포넌트
  - Switch : Route를 찾아서 컴포넌트를 렌더링
  - Route : 안에 컴포넌트 생성
    - 위 컴포넌트들은 url이 변경되면 무엇을 보여줄지 결정한다.
  - a 태그를 사용해도 되지만 페이지 전체가 다시 실행되는 문제가 있음 (왜 react써)
    - Link 브라우저의 새로고침 없이도 유저를 다른 페이지로 이동시켜준다.
    - `<Link to="/movie">{title}</Link>`

- HashRouter (ex. localhost:0000/#/movie)
- 동적 라우팅
  - url에 변수를 넣는 것 `<Route path="/movie/:id">` 라는 식으로 `:` 로 변수를 표현한다
  - url에 있는 값을 반환해주는 함수 useParams()
    - url의 변수를 객체로 반환한다. 여기서 key는 라우터에 적은 변수명(`"/movie/:id"`)과 같다.
    - 즉, id를 변수로 저장하려면 `const {id} = useParams();`
- url 요청
  - async - await
    ```tsx
    const getMovie = async() => {
    	const json = await(
    		await fetch(`url/movie_id=${id}`);
    	).json();
    }
    ```
  - fetch - then : 잘 안씀
- publishing

  - `npm i gh-pages`
    - 결과물을 깃헙 page에 업로드 할 수 있음
    - html, css, js로 웹사이트를 만들어서 전세계에 무료로 배포
  - `npm run build`
    - 많은 js파일들이 압축된다
  - package.json파일로 가서

    ```tsx
    	"scripts": {
    	// ...
    		"build": "react-scripts build",
    		//...
    		"deploy": "gh-pages -d build",
    		"predeploy": "npm run build", //단축키

    	}
    	//...
    	},
    	"homepage": "https://[github아이디].github.io/[깃헙레포이름]"
    }
    ```

    - `npm run deploy` 를 실행하면 predeploy가 자동으로 실행

  - 업데이트 되려면 5분걸림
  - 만약 react-router-dom 6 버전이면
    - 배포 후, 빈 화면이 나올텐데 Route컴포넌트의 path 경로 를 수정하면 된다.

```js
Route path={`${process.env.PUBLIC_URL}/`} element={< Home />}
```

## 7/10(수)

- [Learn Next.js](https://nextjs.org/learn/dashboard-app) - Next.js 기초 공부

### Next.js란?

- Next.js는 React를 기반으로 하는 프레임워크입니다.
- Vercel에서 개발하였으며 서버 사이드 렌더링(SSR)과 정적 사이트 생성(SSG)을 지원합니다.
- 파일 기반 라우팅, API 라우팅, 이미지 최적화 등 다양한 기능을 내장하고 있습니다.
- React의 단점인 초기 로딩 속도와 SEO 문제를 해결하기 위해 만들어졌습니다.
- 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), 클라이언트 사이드 렌더링(CSR)을 모두 지원합니다.
- 페이지를 미리 렌더링하여 더 나은 성능과 SEO를 제공합니다.
- SSR을 통해 서버에서 초기 페이지를 렌더링하고, 클라이언트 측에서 추가 상호작용을 처리합니다.
- SSG를 통해 빌드 시 HTML 파일을 생성하여 빠른 로딩 속도를 제공합니다.

- pnpm : npm이나 yarn보다 더 효율적이고 빠른 패키지 매니저.
  `npm install -g pnpm`
- Next js 앱을 만드려면 프로젝트 폴더로 이동해서
  `npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm`
- 폴더 구조
  [learn-folder-structure.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/704be711-e1a0-444e-a9fd-b112cc3ebae1/learn-folder-structure.avif)
  - app : 모든 라우트, 컴포넌트, 로직을 포함
  - app/lib : 재사용가능한 유틸리티 함수와 데이터 fetch함수같은 앱에 사용되는 함수들
  - app/ui : 모든 UI 컴포넌트
  - public : 이미지같은 정적 에셋들
  - next.config.js : config 파일

#### [**Placeholder data**](https://nextjs.org/learn/dashboard-app/getting-started#placeholder-data)

- json 포맷이나 자바스크립트 객체 사용
- [mockAPI](https://mockapi.io/)같이 3자 서비스
- app/lib/placeholder-data.ts 경로에 임의로 생성 (DB 테이블처럼)
  ```tsx
  const invoices = [
    {
      customer_id: customers[0].id,
      amount: 15795,
      status: "pending",
      date: "2022-12-06",
    },
    {
      customer_id: customers[1].id,
      amount: 20348,
      status: "pending",
      date: "2022-11-14",
    },
    // ...
  ];
  ```
- 실행
  `pnpm i`
  `pnpm run dev`

## 7/11(목)

- [Learn Next.js](https://nextjs.org/learn/dashboard-app) - Next.js 기초 공부

## CSS 스타일링

목표 :

- global CSS파일을 어플리케이션에 적용하는 방법
- 스타일 적용 방법 : Tailwind와 CSS모듈
- clsx 유틸리티 패키지로 클래스 이름 조건부 추가하는 방법

- Global styles

  - /app/ui 폴더에 global.css

    - 보통 모든 라우트에 적용할 CSS 규칙이다.
    - 아무 컴포넌트에나 import할수 있지만 보통 최상위 컴포넌트에 추가하는 것이 좋다.
    - next.js에선  [root layout](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required) 이다.
    - /app/layout.tsx에서 global styles를 추가함

    ```tsx
    import "@/app/ui/global.css";

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      );
    }
    ```

  - tailwind
    - 자동 설치 : create-next-app을 사용해서 next 앱을 만들 때 tailwind 사용할거냐는 물음에 yes 선택
  - CSS 모듈

    - [CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support) 자동으로 유니크한 클래스 이름으로 만들어서 css 컴포넌트 충돌이 일어나지 않음
    - `moduleName.module.css` 로 만들어서 클래스 이름 .shape{}으로 생성한 후,

      ```tsx
      import styles from "@/app/ui/home.module.css";

      <div className={styles.shape} />;
      ```

  - 클래스 이름을 토글하는 [clsx](https://github.com/lukeed/clsx) 라이브러리[**Using the `clsx` library to toggle class names**](https://nextjs.org/learn/dashboard-app/css-styling#using-the-clsx-library-to-toggle-class-names)
    - 상태 또는 다른 조건에 따라 요소를 조건부로 스타일화 해야 하는 경우
    - 쉽게 클래스 이름을 변경하는 [`clsx`](https://www.npmjs.com/package/clsx) 라이브러리.
    - status를 수용하는 `InvoiceStatus` 를 만든다고 가정할 때,
      - status는 `pending` or `paid`

## [폰트와 이미지 최적화](https://nextjs.org/learn/dashboard-app/optimizing-fonts-images)

목표 :

- next/font로 커스텀 폰트 추가하는 방법
- next/image로 이미지 추가하는 방법
- Next.js에서 폰트와 이미지 최적화하는 방법

- 왜 폰트를 최적화 해야 하는가?
  - 폰트 파일을 fetch하거나 load하면 [성능에 영향](https://vercel.com/blog/how-core-web-vitals-affect-seo)을 끼친다.
- Next.js는 자동으로 next/font 모듈을 사용하면 최적화해준다.
  - 빌드 시간과 정적 에셋을 호스트할때 폰트 파일을 다운로드함
  - 즉, 사용자가 우리 앱에 방문할 때 추가적인 네트워크 요청이 없음
- 구글 폰트 추가하기

  - /app/ui 폴더에 `font.ts` 파일 생성
  - Import the `Inter` font from the `next/font/google` module

    ```tsx
    import { Inter } from "next/font/google";

    export const inter = Inter({ subsets: ["latin"] });
    ```

    # layout.tsx

    ```tsx
    import "@/app/ui/global.css";
    import { inter } from "@/app/ui/fonts";

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
      );
    }
    ```

    - 테일윈드의 `antialiased` 글자를 매끄럽게 다듭는다. 좋은 터치감을 더해줌

  - [두 번째 폰트 추가하기](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#using-multiple-fonts)  [full list of options](https://nextjs.org/docs/app/api-reference/components/font#font-function-arguments).

    - fonts.ts 파일에 export 변수를 추가한다.
    - [Google Fonts](https://fonts.google.com/) 를 참고하여 작성 할 수 있음

    ```tsx
    import { Inter, Lusitana } from "next/font/google";

    export const inter = Inter({ subsets: ["latin"] });

    export const lusitana = Lusitana({
      weight: ["400", "700"],
      subsets: ["latin"],
    });
    ```

    - 적용 방법

    ```tsx
    // /app/page.tsx
    import { lusitana } from '@/app/ui/fonts';

    export default function Page() {
      return (
        // ...
        <p
          className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
        >
          <strong>Welcome to Acme.</strong> This is the example for the{' '}
          <a href="https://nextjs.org/learn/" className="text-blue-500">
            Next.js Learn Course
          </a>
          , brought to you by Vercel.
        </p>
        // ...
      );
    ```

- 왜 이미지를 최적화해야할까?
  - /public 폴더에 정적 에셋들을 제공한다. 어플리케이션에서 이 폴더에 참조할 수 있다.
    ```tsx
    <img src="/hero.png" alt="Screenshots of the dashboard project showing desktop version" />
    ```
  - 하지만, 하나하나 사용자가 이미지 크기, 동적으로 이동 등 조절을 해야 한다.
    - 이미지가 다양한 화면 크기에 반응하는지 확인합니다.
    - 다양한 장치의 이미지 크기를 지정합니다.
    - 영상이 로드될 때 레이아웃 이동을 방지합니다.
    - 사용자의 뷰포트 밖에 있는 이미지를 레이지 로드합니다.
- <Image> 컴포넌트

  - HTML의 `<img>`태그를 확장한 컴포넌트. 자동으로 이미지를 최적화한다.

    - 영상을 로드할 때 레이아웃이 자동으로 이동하는 것을 방지합니다.
    - 더 작은 뷰포트를 가진 장치로 큰 이미지를 전송하지 않도록 이미지 크기를 조정합니다.
    - 기본적으로 이미지 로드가 느립니다(이미지가 뷰포트에 들어갈 때 로드됨).
    - 브라우저가 지원할 때 [WebP](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp) 및  [AVIF](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image)와 같은 최신 형식으로 이미지를 제공합니다.

    ```tsx
    import Image from "next/image";

    <Image
      src="/hero-desktop.png"
      width={1000}
      height={760}
      className="hidden md:block"
      alt="Screenshots of the dashboard project showing desktop version"
    />;
    ```

    - 레이아웃 이동을 방지하기 위해 너비 1000px, 높이 760px 설정
      - 원본과 동일한 비율로 설정
    - md:block
      - 모바일 화면의 DOM에서 이미지를 제거하기 위해 클래스를 숨기고, 테스크톱 화면에서만 이미지가 보이도록 설정
      - 만약 반대로, 모바일 화면에서는 보이고 PC화면에서는 제거하려면?

```tsx
<Image
  src="/hero-mobile.png"
  width={560}
  height={620}
  className="block md:hidden"
  alt="Screenshot of the dashboard project showing mobile version"
/>
```

## 7/15(월)

- [Learn Next.js](https://nextjs.org/learn/dashboard-app) - Next.js 기초 공부

### 레이아웃과 페이지 만들기

- 목표:
  - 파일 시스템 라우팅을 사용하는 `dashboard` 라우트 만들기
  - 새 라우트 segment를 만들 때 폴더와 파일의 역할 이해
  - 여러 대시보드 페이지 간에 공유할 수 있는 nested layout만들기
  - colocation, 부분 렌더링, root 레이아웃이 무엇인지 이해
- Nested routing
  [folders-to-url-segments.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/bcd68906-4bd1-4d53-8018-30c43cfc3a8a/folders-to-url-segments.avif)
  - next.js는 파일 시스템을 사용하는데, 폴더를 사용하여 중첩된 경로를 만든다.
  - 각 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트를 나타낸다.
  - `layout.tsx` 와 `page.tsx` 파일을 사용하여 각 라우트에 대해 별도의 UI를 만들 수 있음
  - `page.tsx`는 React 컴포넌트를 추출하는 특수한 Next.js파일이고 경로에 접근할 수 있어야 한다.
  - /app/page.tsx → 경로 `/` 관련된 홈 페이지
  - nested route를 만드려면 폴더를 서로 중첩하고 폴더 내부에 page.tsx파일을 추가할 수 있음
    [dashboard-route.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/06ef43d8-7d04-452b-b42d-a8a2fa1d4983/dashboard-route.avif)
    /app/dashboard/page.tsx → 는 /dashboard 경로와 관련있음
- dashboard 페이지 만들기
  - /app 폴더에 dashboard 폴더 생성
    ```tsx
    // page.tsx
    export default function Page() {
      return <p>Dashboard Page</p>;
    }
    ```
  - localhost:3000/dashboard 로 접근 가능
  - 폴더를 사용해서 새로운 라우트를 만들고 `page` 파일을 추가
  - Next.js는 페이지 파일에 특별한 이름을 가짐으로써 UI 구성 요소, 테스트 파일 및 기타 관련 코드를 사용자의 경로와 공동으로 지정할 수 있음
    - 페이지 파일 내부의 내용만 공개작으로 접근할 수 있음
    - ex) /ui 및 /lib 폴더는 경로와 함꼐 /app 폴더 내부에 공동으로 지정됨
  - Customer 페이지 만들기
  - Invoice 페이지 만들기
    [routing-solution.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/684c6acb-6076-458e-ab56-325f658cb345/routing-solution.avif)
    - 폴더를 생성한후, 폴더 내에 page.tsx파일을 생성하여 Page 컴포넌트를 만든다
- dashboard 레이아웃 만들기
  [shared-layout.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/21705186-ebe9-4000-a700-69c9efec5c20/shared-layout.avif)

  - 대시보드 폴더 내에 현재 여러 페이지가 있고 이를 공유하는 일종의 내비게이션이 있다.
  - 특수 layout.tsx파일을 사용하여 UI를 만들 수 있다.

  ```tsx
  import SideNav from "@/app/ui/dashboard/sidenav";

  export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    );
  }
  ```

  - <Layout /> 컴포넌트는 `children` prop을 받는다.
  - 이 child는 page이거나 또다른 layout이다.
  - [partial rendering](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering):
    [partial-rendering-dashboard.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/1f74aa38-7a50-49ea-8337-c9da83bee1b0/partial-rendering-dashboard.avif)
    - Next.js에서 레이아웃을 사용하는 것의 이점은 페이지 구성 요소만 업데이트되고 레이아웃은 다시 렌더링되지 않는다.

- Root Layout
  - /app/layout.tsx는 root layout이라고 불린다. root layout에 추가하는 UI는 어플리케이션 모든 페이지에 공유된다.
  - root layout을 사용하여 `<html>`과 `<body>`를 수정하고 메타데이터를 추가할 수 있다.
  - /app/dashboard/layout.tsx는 대시보드 페이지에서만 유니크하게 만들어졌으므로 root layout에 UI를 추가할 필요가 없음

## 7/16(화)

- [Learn Next.js](https://nextjs.org/learn/dashboard-app) - Next.js 기초 공부

### [페이지간 Navigating](https://nextjs.org/learn/dashboard-app/navigating-between-pages)

- 주제:

  - next/link 컴포넌트를 사용하는 방법
  - usePathname() 후크로 active link를 보여주는 방법
  - Next.js에서 내비게이션이 작동하는 방법

- navigation을 왜 최적화 해야할까?
  - 페이지 간 link를 할 때, `<a>` 태그를 사용하곤 했다. 사이드바 링크는 `<a>`요소를 사용하지만 브라우저에서 home, invoices, customers 페이지를 탐색할 때 어떤일이 벌어질까?
  - 각 페이지 navigation에 full page 새로고침이 있다.
- `<Link>` 컴포넌트

  - 어플리케이션에서 페이지 간 링크를 하는 컴포넌트
  - `<Link>`는 JavaScript로 [client-side navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)를 하도록 허용한다.
  - `<Link />`를 사용하면, `/app/ui/dashboard/nav-links.tsx` 페이지를 열게 되고, 그리고 [`next/link`](https://nextjs.org/docs/app/api-reference/components/link)에서 `Link` 컴포넌트를 import한다.
  - `<a>`태그 대신에 `<Link>`태그로 대체할 수 있게 된다.

  ```tsx
  import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
  import Link from "next/link";

  // ...

  export default function NavLinks() {
    return (
      <>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </>
    );
  }
  ```

  - `<a href="…">`대신 `<Link href="…">`를 사용한다.
  - 이제 새로고침(refresh)없이 페이지 간 탐색을 진행할 수 있다.
  - 어플리케이션의 일부가 서버에서 렌더링되지만 전체 페이지 새로 고침이 없으므로 웹 앱처럼 느껴진다. 왜 그럴까?

- 자동 코드 splitting과 prefetching
  - Next js는 자동으로 코드를 route segment별로 어플리케이션을 분할한다.
  - 브라우저가 초기 load를 할때 모든 어플리케이션 코드를 로드를 하는 전통적인 React [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)와는 다르다.
  - 라우트 별로 코드를 분할하는 것은 page가 고립되어있다는 것을 의미한다. 만약 특정 페이지가 에러를 throw하면 어플리케이션의 나머지 부분은 여전히 작동한다.
  - 프로덕션에서는 또한, 브라우저 뷰포트에서 [`<Link>`](https://nextjs.org/docs/api-reference/next/link) 컴포넌트가 나타날 때마다 Next.js가 자동으로 백그라운드에서 연결된 라우트에 대한 코드를 prefetch한다. (미리 fetch)
  - 사용자가 링크를 클릭할때 쯤 이미 대상 페이지의 코드가 백그라운드에서 로드되고 이것이 페이지 전환을 거의 즉시(near-instant) 수행할 수 있게 하는 이유다.
  - navigation이 어떻게 작동하는지 →  [how navigation works](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)
- Pattern : Showing active links

  - 일반적인 UI 패턴은 사용자가 현재 어떤 페이지에 있는지 나타내는 active link를 보여주는 것이다.
  - 이를 위해 개발자는 URL로부터 사용자의 현재 경로를 얻어와야한다.
  - Next.js는 경로를 확인하고 이 패턴을 구현하는 데 사용할 수 있는 `usePathname()` 이라는 후크(hook)를 제공한다.
  - [usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname)은 후크이므로 `nav-link.tsx` 를 클라이언트 컴포넌트로 변환해야 한다.
    파일 위에 `use client` 를 추가하고 `next/navigation` 에서 `usePathname()` 를 import한다.

    ```tsx
    // /app/ui/dashboard/nav-links.tsx

    "use client";

    import { UserGroupIcon, HomeIcon, InboxIcon } from "@heroicons/react/24/outline";
    import Link from "next/link";
    import { usePathname } from "next/navigation";

    // ...
    ```

  - `<NavLinks />` 컴포넌트 안에 `pathname` 변수에 경로를 할당한다.
    ```tsx
    export default function NavLinks() {
      const pathname = usePathname();
      // ...
    }
    ```
  - CSS 스타일링 챕터에서 `clsx` 라이브러리를 사용하여 link가 활성화 되어있을 때 조건부로 클래스 이름을 적용할 수 있다. `link.href` 가 `pathname` 를 일치하면 파란색 텍스트와 밝은 파란색(light blue)배경으로 링크를 표시해야한다.

    ```tsx
    "use client";

    import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
    import Link from "next/link";
    import { usePathname } from "next/navigation";
    import clsx from "clsx";

    // ...

    export default function NavLinks() {
      const pathname = usePathname();

      return (
        <>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          })}
        </>
      );
    }
    ```

## 7/17(수)

- [Learn Next.js](https://nextjs.org/learn/dashboard-app) - Next.js 기초 공부

## [Setting Up Your Database](https://nextjs.org/learn/dashboard-app/setting-up-your-database)

dashboard에서 계속 작업하기 전에, 데이터가 조금 필요할 것이다. 이 챕터에서는 `@vercel/postgres` PostrgreSQL 데이터 베이스를 사용하여 세팅한다. 만약 이미 PostgreSQL과 친숙하고 개발자 자신만의 provider를 선호한다면 이 챕터는 스킵하고 알아서 세팅해도 좋다.

- 목표:

  - GitHub에 프로젝트 Push하기
  - Vercel 계정을 세팅하고 즉각적인 preview와 배포를 위해 GitHub 레포를 링크하기
  - 프로젝트를 만들고 Postgres 데이터베이스에 연결
  - 초기 데이터로 데이터베이스 시드하기

- GitHub 레포지터리 만들기
  - GitLab이나 Bitbucket도 가능
- [Vercel 계정 만들기](https://vercel.com/signup)
  - 위 깃 계정과 연동한다.
- 방금 만든 깃헙 레포지터리를 선택하고 가져올 수 있는 화면 : install 클릭
  [import-git-repo.avif](https://prod-files-secure.s3.us-west-2.amazonaws.com/d51cbaf0-9492-4156-90cf-14cb81b94923/816f376b-31f8-41dd-ac63-a55eaf3ebe6b/import-git-repo.avif)
  - 프로젝트 이름을 짓고 Deploy 선택
  - 깃헙 레포지터리와 연결하면 main 브랜치에 변경 사항을 적용할 때마다 Vercel이 자동으로 애플리케이션을 재배치하고 configuration이 필요 없다. pull request를 열때 즉시 미리 보기도 제공해서 배포 오류를 조기에 파악하고 팀원과 프로젝트 미리 보기를 공유하여 피드백을 받을 수 있다.
- Postgres 데이터베이스 만들기
  - `Continue to Dashboard` 를 클릭하고 `Storage` 탭을 선택한다.
  - **Postgres → Connect Store** → **Create New** → **Postgres** → **Continue**.
  - 데이터베이스 region은 **Washington D.C (iad1)**로 하는 것을 권장
    - 모든 Vercel 프로젝트의 [default region](https://vercel.com/docs/functions/configuring-functions/region)이다.
    - 데이터에비으슬 동일한 지역 또는 어플리케이션 코드와 가깝게 배치해서 데이터 요청에 대한  [latency](https://developer.mozilla.org/en-US/docs/Web/Performance/Understanding_latency)을 줄일 수 있다.
    - 한번 region을 선택하면 바꿀 수 없다. 만약 다른 region을 사용하고 싶으면 데이터베이스를 만들기 전에 알아야 한다.
  - 연결이 되었다면, `.env.local` 탭으로 이동하고 `Show secret and Copy Snippet` 을 클릭한다. 그것들을 복사하기 전에 secrets를 드러내는 것을 권장.
  - 코드 에디터로 돌아가서 `.gitignore` 파일과 `.env` 파일을 생성하자.
    - 데이터베이스 secrets를 gitignore에 추가하기
    - `pnpm i @vercel/postgres` in your terminal to install the [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)
- 데이터베이스를 seed하기
  - 데이터베이스가 만들어졌으니 초기 데이터를 시드하자.
  - /app 안에서 `seed` 폴더를 생성하고 `route.ts`를 주석해제한다.
    - 이 폴더에는 데이터베이스 시드에 사용되는 `route.ts` 라는 Next.js Route Handler가 포함되어 있다. 이것은 브라우저에서 접근하여 데이터베이스를 채우기 시작할 수 있는 server-side endpoint가 생성된다.
  - 전체적으로 설명하자면, 스크립트는 SQL을 사용하여 테이블을 만들고 `placeholder-data.ts` 파일로부터 데이터를 사용하여 테이블을 만든 후 채운다.
  - [localhost:3000/seed](http://localhost:3000/seed로) 로 이동했을때 "Database seeded successfully”라는 메세지가 뜬다면 성공이다.
