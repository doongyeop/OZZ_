// import { useState } from 'react'

// export const CoordiBookSelectModal = ({
//   favoriteGroups,
//   onSelect,
//   onClose,
// }: {
//   favoriteGroups: any[]
//   onSelect: (favoriteGroupId: number) => void
//   onClose: () => void
// }) => {
//   return (
//     <div className="modal">
//       <h2>코디북 선택</h2>
//       <ul>
//         {favoriteGroups.map((group) => (
//           <li key={group.favoriteGroupId}>
//             <button onClick={() => onSelect(group.favoriteGroupId)}>
//               {group.name}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <button onClick={onClose}>취소</button>
//     </div>
//   )
// }
