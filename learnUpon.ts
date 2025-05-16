// Our task is to write a function that serializes its input into a string. Converting
// different data types to string, with similar behavior of JSON.stringify. We need to
// handle primitive values, arrays, objects and unsupported types.

// Example: 
// ```
// // Given function call
// const str = {
//   id: 123,
//   name: "John Doe",
//   scores: [10, 3.5, undefined, 5],
//   modules: {
//     "Basic Javascript": { started: true, completed: true },
//     "Advanced Javascript": { started: false, completed: false },
//   },
//    modules1: new Map{[
//     ["Basic Javascript": { started: true, completed: true }],
//      ["Advanced Javascript": { started: false, completed: false }],
    
//   ]}
// };

// // Expected output
// str === '{"id":123,"name":"Jhon Doe","scores":[10,3.5,null,5],"modules":{"Basic Javascript":{"started":true,"completed":true},"Advanced Javascript":{"started":false,"completed":false}}}'


// serializeJSON(str)

// serializeJSON(new Map(...))

// // str === '123'

// ```
// */


// str === '123'

export function serializeJSON(value: any): string {
  const seen = new WeakSet();

  function serialize(val: any): string {
    // Handle null and undefined
    if (val === null || val === undefined) {
      return 'null';
    }

    // Handle primitive types
    const type = typeof val;
    if (type === 'number' || type === 'boolean') {
      return String(val);
    }
    if (type === 'string') {
      return JSON.stringify(val); // Ensures proper escaping
    }

    // Handle arrays
    if (Array.isArray(val)) {
      return `[${val.map(item => item === undefined ? 'null' : serialize(item)).join(',')}]`;
    }

    // Handle Maps
    if (val instanceof Map) {
      const entries: string[] = [];
      for (const [k, v] of val.entries()) {
        if (typeof k !== 'string') {
          throw new Error('Only string keys are supported in Map');
        }
        entries.push(`${JSON.stringify(k)}:${serialize(v)}`);
      }
      return `{${entries.join(',')}}`;
    }

    // Handle objects
    if (typeof val === 'object') {
      if (seen.has(val)) {
        throw new Error('Circular reference detected');
      }
      seen.add(val);

      const entries: string[] = [];
      for (const key of Object.keys(val)) {
        const v = val[key];
        if (v === undefined) continue; // Skip undefined in objects
        entries.push(`${JSON.stringify(key)}:${serialize(v)}`);
      }
      return `{${entries.join(',')}}`;
    }

    // Unsupported type
    return 'null';
  }

  return serialize(value);
}

// * objekat u objektu - serijalizaija
// * Da ne bi doslo do beskonacne lupe napraviti mapu u koju dodavati vec serijalizovane elemente i prilikom serijalizacije pitati da li je taj eleemen vec u mapi, 
// * ako jeste preskociti ga ili bacigti gresku.
// * ako jeste preskociti ga ili bacigti gresku.