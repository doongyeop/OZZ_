# **Sub PJT 2 1주차**

## 07.15 (월)

### ✔ Musinsa Order List Test

```javascript
const axios = require("axios");
const cheerio = require("cheerio");

const loginPageUrl = "https://www.musinsa.com/auth/login";
const orderListUrl =
  "https://www.musinsa.com/order-service/mypage/order_list_opt";

// Function to fetch CSRF token from login page
const fetchCSRFToken = () => {
  return axios
    .get(loginPageUrl)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract CSRF token from the form
      const csrfToken = $("input[name=csrfToken]").val();
      if (csrfToken) {
        console.log("Found CSRF Token:", csrfToken);
        return csrfToken;
      } else {
        throw new Error("CSRF Token not found");
      }
    })
    .catch((error) => {
      throw new Error("Error fetching login page:", error);
    });
};

// Function to login using the CSRF token
const login = (csrfToken) => {
  const credentials = {
    id: "여기 아이디",
    pw: "여기 비번",
    csrfToken: csrfToken,
  };

  const formData = new URLSearchParams();
  formData.append("id", credentials.id);
  formData.append("pw", credentials.pw);
  formData.append("csrfToken", credentials.csrfToken);

  // Send login request
  return axios
    .post(loginPageUrl, formData)
    .then((response) => {
      console.log("Login successful");
      // Extract and return session cookies for subsequent requests
      return response.headers["set-cookie"];
    })
    .catch((error) => {
      throw new Error("Error during login:", error);
    });
};

// Function to fetch order list after successful login
const fetchOrderList = (cookies) => {
  const config = {
    headers: {
      Cookie: cookies.join("; "),
    },
  };

  return axios
    .get(orderListUrl, config)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const orderList = [];

      // Parse each order list item and extract relevant information
      $(".order-list__item").each((index, element) => {
        const orderNumber = $(element).attr("data-ordid");
        const orderDate = $(element)
          .find(".order-list__payment__date")
          .text()
          .trim();
        const productName = $(element)
          .find(".order-goods-information__name")
          .text()
          .trim();
        const brandName = $(element)
          .find(".order-goods-information__brand")
          .text()
          .trim();
        const price = $(element)
          .find(".order-goods-information__price__sale")
          .text()
          .trim();
        const thumbnailUrl = $(element)
          .find(".order-goods-thumbnail__image")
          .attr("src");

        const orderItem = {
          orderNumber: orderNumber,
          orderDate: orderDate,
          productName: productName,
          brandName: brandName,
          price: price,
          thumbnailUrl: thumbnailUrl,
        };

        orderList.push(orderItem);
      });

      return orderList;
    })
    .catch((error) => {
      throw new Error("Error fetching order list:", error);
    });
};

// Usage: Fetch CSRF token, login, and then fetch order list
fetchCSRFToken()
  .then((csrfToken) => {
    return login(csrfToken);
  })
  .then((cookies) => {
    return fetchOrderList(cookies);
  })
  .then((orderList) => {
    console.log("Order list fetched successfully:");
    console.log(orderList); // Display order list array
  })
  .catch((error) => {
    console.error(error.message);
  });
```


---

## 07.16 (화)

### ✔ [기능명세서](https://docs.google.com/spreadsheets/d/1m-osYYjbe7sdoePF93FguSynrAsAEDxvBsTLJgjsiM8/edit?gid=1964034166#gid=1964034166)
### ✔ [메뉴구조도](https://docs.google.com/spreadsheets/d/1m-osYYjbe7sdoePF93FguSynrAsAEDxvBsTLJgjsiM8/edit?gid=465542578#gid=465542578)

---

## 07.17 (수)


### ✔ [Figma](https://www.figma.com/design/7WUqXjKvUcDPLKYMUa9P4Y/%EC%98%B7%EC%A7%B1?node-id=0-1&t=oNhZxN2dwO8eLkQ9-0) 목업 만들기 

| 1depth | 2depth | 3depth | Type | ID | 접근권한 | 목업 담당 | 목업 진행상태 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 메인 화면 | 오늘의 옷 코디 추천 | 옷 코디 추천 페이지 이동 | page | M_0.0.0 | 회원 | 김혜인 | done |
|  | 내 옷장 | 전체 보기 버튼 | page | M_0.0.1 | 회원 | 김혜인 | done |
| 옷 코디 추천 | 오늘의 날씨 정보 | 일주일 간 날씨 선택 버튼 | page | M_0.3.0 | 회원 | 김혜인 | In progress |
|  | 스타일 태그 설정 | 태그 버튼으로 그리기 | page | M_0.3.1 | 회원 | 김혜인 | In progress |
|  | 코디 추천 결과 | 무한 스크롤(가로)로 자동 생성1개씩 띄우기 | page | M_0.3.2 | 회원 | 김혜인 | In progress |
|  |  | 공유 버튼 | page | M_0.3.3 | 회원 | 김혜인 | In progress |
|  |  | 저장 버튼 | page | M_0.3.4 | 회원 | 김혜인 | In progress |
