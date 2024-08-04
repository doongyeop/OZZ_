import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

interface Goods {
  sno: number
  name: string
  image_still: string
}

interface Market {
  name: string
}

interface OrderItem {
  goods: Goods
  market: Market
  options: string[]
  processing_status: number
}

interface Order {
  ordered_at: string
  order_items: OrderItem[]
}

interface OrderData {
  orderDate: string
  goodsName: string
  goodsImage: string
  marketName: string
  options: string[]
}

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {
  const { userId, password } = await request.json()

  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()

  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  )

  await page.setViewport({ width: 375, height: 812, isMobile: true })

  await page.setExtraHTTPHeaders({
    accept: '*/*',
    'content-type': 'application/json',
    origin: 'https://m.a-bly.com',
    referer: 'https://m.a-bly.com/',
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  })

  await page.goto('https://m.a-bly.com/login/email')
  await page.type('input[name="email"]', userId)
  await page.type('input[name="password"]', password)

  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  const cookies = await page.cookies()
  const cookieString = cookies
    .map(
      (cookie: { name: string; value: string }) =>
        `${cookie.name}=${cookie.value}`,
    )
    .join('; ')

  const authTokenCookie = cookies.find(
    (cookie: { name: string; value: string }) =>
      cookie.name === 'ably-jwt-token',
  )
  const authToken = authTokenCookie ? authTokenCookie.value : null

  if (!authToken) {
    console.error('인증 토큰을 찾을 수 없습니다.')
    await browser.close()
    return NextResponse.json(
      { error: '인증 토큰을 찾을 수 없습니다.' },
      { status: 401 },
    )
  }

  const orderData: OrderData[] = []
  let pageNum = 1
  let moreData = true

  while (moreData) {
    const orderListUrl = `https://api.a-bly.com/webview/orders/?page=${pageNum}&query=&min_ordered_at=2015-09-07&max_ordered_at=2024-12-31`

    // eslint-disable-next-line no-await-in-loop
    const response = await page.evaluate(
      async (url, cookieStr, token) => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json, text/plain, */*',
            authorization: `JWT ${token}`,
            origin: 'https://m.a-bly.com',
            referer: 'https://m.a-bly.com/',
            'user-agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            cookie: cookieStr,
          },
        })
        return res.json()
      },
      orderListUrl,
      cookieString,
      authToken,
    )

    if (response.orders && response.orders.length > 0) {
      response.orders.forEach((order: Order) => {
        order.order_items.forEach((item: OrderItem) => {
          if (item.processing_status === 5) {
            orderData.push({
              orderDate: order.ordered_at,
              goodsName: item.goods.name,
              goodsImage: item.goods.image_still,
              marketName: item.market.name,
              options: item.options,
            })
          }
        })
      })
      pageNum += 1
      if (pageNum > response.max_page_number) {
        moreData = false
      }
    } else {
      moreData = false
    }
  }

  console.log('모든 주문 내역:', orderData)

  await browser.close()
  return NextResponse.json(orderData, { status: 200 })
}
