// Collaboration commit 22 by Bradley747 - 2025-11-08 16:29:27
// Collaboration commit 12 by Bradley747 - 2025-11-08 16:20:54
// // useCounter.test.ts
// import { expect, test, afterEach } from 'vitest'
// import { renderHook, cleanup } from '@testing-library/react';
// import { useFhevm } from './useFhevm';

// test('should increment counter', () => {
//   const { result } = renderHook(() => useFhevm({ provider: "http://localhost:8545", chainId: 31337 }));

//   // const one =1;
//   // // Initial value
//   // expect(one).toBe(1);
//   // console.log("test = status =" + result.current.status);

// //   // Increment with act()
// //   act(() => {
// //     result.current.increment();
// //   });

// //   expect(result.current.count).toBe(1);
// });

// test('should increment counter2', () => {
//   const { result } = renderHook(() => useFhevm({ provider: "http://localhost:8545", chainId: 31337 }));

//   const one =1;
//   // Initial value
//   expect(one).toBe(1);
//   console.log("test = status =" + result.current.status);

// //   // Increment with act()
// //   act(() => {
// //     result.current.increment();
// //   });

// //   expect(result.current.count).toBe(1);
// });

// afterEach(() => {
//   console.log("BLA");
//   cleanup()
// });