import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
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
  const response = await fetch(loginPageUrl)
  const html = await response.text()
  const $ = cheerio.load(html)
  const csrfToken = $('input[name=csrfToken]').val() as string
  if (!csrfToken) throw new Error('CSRF Token not found')
  console.log('Found CSRF Token:', csrfToken)
  return csrfToken
}

// Function to login using the CSRF token
const login = async (
  csrfToken: string,
  userId: string,
  password: string,
): Promise<string[]> => {
  const credentials = {
    id: userId,
    pw: password,
    csrfToken: csrfToken,
  }

  const formData = new URLSearchParams(credentials)
  const response = await fetch(loginPageUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  })

  const responseText = await response.text()

  // Check for login failure by inspecting the response data
  if (responseText.includes("alert('아이디 또는 패스워드를 확인하세요.')")) {
    throw new Error('아이디 또는 패스워드를 확인하세요.')
  }

  console.log('Login successful')
  const cookies = response.headers.get('set-cookie')?.split(',') ?? []
  return cookies
}

// Function to transform thumbnail URL
const transformThumbnailUrl = (thumbnailUrl: string): string => {
  let transformedUrl = thumbnailUrl.replace('//', 'https://')
  transformedUrl = transformedUrl.replace('_120.jpg', '_500.jpg')
  return transformedUrl
}

// Function to fetch order list after successful login
const fetchOrderList = async (
  cookies: string[],
  page = 1,
  orderList: Order[] = [],
): Promise<Order[]> => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const params = new URLSearchParams({
    state_type: 'ord_4',
    ord_state: '50',
    period: 'input',
    dt_fr: '2009-01-01',
    dt_to: today,
    is_ajax: 'Y',
    page: page.toString(),
  })

  const response = await fetch(`${orderListUrl}?${params}`, {
    headers: {
      Cookie: cookies.join('; '),
    },
  })

  const text = await response.text()
  const data: OrderListResponse = JSON.parse(text)

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
}

// Main function to execute the entire flow
async function getMusinsaOrderLists(
  userId: string,
  password: string,
): Promise<Order[]> {
  const csrfToken = await fetchCSRFToken()
  const cookies = await login(csrfToken, userId, password)
  const orderList = await fetchOrderList(cookies)
  console.log('Order list fetched successfully:')
  console.log(orderList)
  return orderList
}

// API route handler
export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json()
    const orderList = await getMusinsaOrderLists(userId, password)

    return NextResponse.json(orderList)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
