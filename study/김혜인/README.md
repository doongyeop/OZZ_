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
