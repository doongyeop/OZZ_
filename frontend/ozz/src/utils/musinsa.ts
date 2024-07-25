import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'
import { format } from 'date-fns'

// URL Constants
const loginPageUrl = 'https://www.musinsa.com/auth/login'
const orderListUrl =
  'https://www.musinsa.com/order-service/mypage/order_list_opt'

// Define types for responses
interface OrderListResponse {
  code: string
  output: string
  isPrevButton: string
}

interface Order {
  orderNumber: string
  orderDate: string
  productName: string
  brandName: string
  price: string
  thumbnailUrl: string
}

// Function to fetch CSRF token from login page
const fetchCSRFToken = async (): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await axios.get(loginPageUrl)
    const $ = cheerio.load(response.data)
    const csrfToken = $('input[name=csrfToken]').val() as string
    if (!csrfToken) throw new Error('CSRF Token not found')
    console.log('Found CSRF Token:', csrfToken)
    return csrfToken
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching login page: ${error.message}`)
    } else {
      throw new Error(
        'An unknown error occurred while fetching the login page.',
      )
    }
  }
}

// Function to login using the CSRF token
const login = async (csrfToken: string): Promise<string[]> => {
  try {
    const credentials = {
      id: '아이디',
      pw: '비밀번호',
      csrfToken: csrfToken,
    }

    const formData = new URLSearchParams(credentials)
    const response: AxiosResponse<void> = await axios.post(
      loginPageUrl,
      formData,
    )
    console.log('Login successful')
    return response.headers['set-cookie'] as string[]
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error during login: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred during login.')
    }
  }
}

// Function to transform thumbnail URL
const transformThumbnailUrl = (thumbnailUrl: string): string => {
  // Replace '//' with 'https://'
  let transformedUrl = thumbnailUrl.replace('//', 'https://')

  // Replace '_120.jpg' with '_500.jpg'
  transformedUrl = transformedUrl.replace('_120.jpg', '_500.jpg')

  return transformedUrl
}

// Function to fetch order list after successful login
const fetchOrderList = async (
  cookies: string[],
  page = 1,
  orderList: Order[] = [],
): Promise<Order[]> => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')
    const params = {
      state_type: 'ord_4',
      ord_state: '50',
      period: 'input',
      dt_fr: '2009-01-01',
      dt_to: today,
      is_ajax: 'Y',
      page: page,
    }

    const config = {
      headers: {
        Cookie: cookies.join('; '),
      },
      params: params,
    }

    const response: AxiosResponse<OrderListResponse> = await axios.get(
      orderListUrl,
      config,
    )
    const data = response.data

    if (data.code === 'success') {
      const $ = cheerio.load(data.output)
      $('.order-list__item').each((index, element) => {
        const orderNumber = $(element).attr('data-ordid') as string
        const orderDate = $(element)
          .find('.order-list__payment__date')
          .text()
          .trim()
          .replace(/\./g, '-')

        $(element)
          .find('.order-goods')
          .each((i, el) => {
            const productName = $(el)
              .find('.order-goods-information__name')
              .text()
              .trim()
            const brandName = $(el)
              .find('.order-goods-information__brand')
              .text()
              .trim()
            const price = $(el)
              .find('.order-goods-information__price__sale')
              .text()
              .trim()
            const thumbnailUrl = $(el)
              .find('.order-goods-thumbnail__image')
              .attr('src') as string

            // Transform thumbnail URL
            const transformedThumbnailUrl = transformThumbnailUrl(thumbnailUrl)

            orderList.push({
              orderNumber,
              orderDate,
              productName,
              brandName,
              price,
              thumbnailUrl: transformedThumbnailUrl,
            })
          })
      })

      if (data.isPrevButton === 'Y') {
        return fetchOrderList(cookies, page + 1, orderList)
      }
    }

    return orderList
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching order list: ${error.message}`)
    } else {
      throw new Error(
        'An unknown error occurred while fetching the order list.',
      )
    }
  }
}

// Main function to execute the entire flow
const main = async (): Promise<void> => {
  try {
    const csrfToken = await fetchCSRFToken()
    const cookies = await login(csrfToken)
    const orderList = await fetchOrderList(cookies)
    console.log('Order list fetched successfully:')
    console.log(orderList)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error('An unknown error occurred.')
    }
  }
}

main()
