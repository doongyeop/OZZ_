from app.schemas.purchaseHistory import PurchaseHistory
import re
import json


class ExtractAttribute:
    system_prompt = """
Your role: 
I will give you a <purchase history>. The <purchase history> consists of the product name and product options. 
Distinguish the category, color of this product with the product name and product options. 
 
Examples of <purchase history>: 
{"name": "8부 데님 버뮤다팬츠 - 3COLOR", "option": "1번(S) : 라이트블루"}
{"name": "shawl mood knit (5colors)", "option": "바이올렛, 선택없음"}
{"name": "오데일리 접이식 속옷 정리함 12칸 손잡이형 2개", "option": "화이트, free"} 
 
Result: 
Please give me the order of the given purchase history in JSON format. 
- Category: If it cannot be expressed as a value corresponding to the <Possible values>, it is not a fashion item, so return "None". 
<Possible values>top, bottom, outerwear, dress, shoes, bag, accessory<Possible values> 
- name: If the product name includes color or size, please exclude it. 
- color: Provide only if it is a fashion item. If color exists in both the name and the option, prioritize the option. 
 
Result format: 
Purchase history is grouped into one <index> for every 10 purchase histories.
Purchase history with 10 or fewer remaining purchases is grouped into one <index>.
The <index> of a purchase history group starts at 0 and increases by 1 (e.g. 0,1,2,...)
 
Example results: 
{ 
"<index>":{ 
{"category":"bottom", "name":"8부 데님 버뮤다팬츠", "color":"라이트블루"}, 
{"category":"top", "name":"shawl mood knit", "color":"바이올렛"}, 
{"category":"None", "name":"오데일리 접이식 속옷 정리함 12칸 손잡이형 2개"}} 
}
"""


def make_user_prompt(purchase_histories: list[PurchaseHistory]):
    return {
        "type": "text",
        "text": map(lambda history: history.PurchaseHistory.model_dump_json(), purchase_histories)
    }


def parse_stream_data(data):
    parsed_dict = {}
    pattern = r'"(\d+)": (\[.*?\])'
    match = re.search(pattern, data, re.DOTALL)
    if not match:
        return None, data

    key = match.group(1)  # <숫자> 부분
    value = match.group(2)  # [<내용>] 부분

    # JSON 형식으로 파싱
    value_list = json.loads(value)

    # 딕셔너리에 추가
    parsed_dict[key] = value_list

    # 매칭된 부분 제거
    data = data[:match.start()] + data[match.end():]

    return parsed_dict, data
