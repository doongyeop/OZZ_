import uuid

from fastapi import APIRouter

from openai import OpenAI
from sse_starlette.sse import EventSourceResponse

from app.core.prompt.normalizePurchaseHistory import parse_stream_data, make_user_prompt
from app.schemas.purchaseHistory import PurchaseHistory

client = OpenAI()

router = APIRouter(prefix="/purchase-history", tags=["Attributes"])


@router.post("/normalize")
async def normalize_endpoint(histories: list[PurchaseHistory]):
    async def normalize_history():
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "Your role: \nI will give you a <purchase history>. The <purchase history> consists of the product name and product options. \nDistinguish the category, color of this product with the product name and product options. \n \nExamples of <purchase history>: \n{\"name\": \"8부 데님 버뮤다팬츠 - 3COLOR\", \"option\": \"1번(S) : 라이트블루\"}\n{\"name\": \"shawl mood knit (5colors)\", \"option\": \"바이올렛, 선택없음\"}\n{\"name\": \"오데일리 접이식 속옷 정리함 12칸 손잡이형 2개\", \"option\": \"화이트, free\"} \n \nResult: \nPlease give me the order of the given purchase history in JSON format. \n- Category: If it cannot be expressed as a value corresponding to the <Possible values>, it is not a fashion item, so return \"None\". \n<Possible values>top, bottom, outerwear, dress, shoes, bag, accessory<Possible values> \n- name: If the product name includes color or size, please exclude it. \n- color: Provide only if it is a fashion item. If color exists in both the name and the option, prioritize the option. \n \nResult format: \nPurchase history is grouped into one <index> for every 10 purchase histories.\nPurchase history with 10 or fewer remaining purchases is grouped into one <index>.\nThe <index> of a purchase history group starts at 0 and increases by 1 (e.g. 0,1,2,...)\n \nExample results: \n{ \n\"<index>\":{ \n{\"category\":\"bottom\", \"name\":\"8부 데님 버뮤다팬츠\", \"color\":\"라이트블루\"}, \n{\"category\":\"top\", \"name\":\"shawl mood knit\", \"color\":\"바이올렛\"}, \n{\"category\":\"None\", \"name\":\"오데일리 접이식 속옷 정리함 12칸 손잡이형 2개\"}} \n}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": make_user_prompt(histories)
                        }
                    ]
                }
            ],
            temperature=1,
            max_tokens=50*len(histories),
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=True,
            response_format={"type": "json_object"},
        )
        buffer = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                buffer += chunk.choices[0].delta.content
                parsed_result, buffer = parse_stream_data(buffer)
                if parsed_result:
                    print(parsed_result)
                    yield {
                        "event":"test",
                        "id":uuid.uuid4(),
                        "data":{**parsed_result}
                    }

    return EventSourceResponse(normalize_history())
