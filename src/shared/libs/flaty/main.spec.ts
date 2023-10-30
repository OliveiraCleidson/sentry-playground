import Flatty from './main';

describe('Flaty Lib - Unit Tests', () => {
  describe('flattenObject', () => {
    test('Given a simple object, When calling flattenObject, Then it should return the same object', () => {
      const input = {
        name: 'John',
        age: 30,
        city: 'New York',
      };

      const result = Flatty.flattenObject(input);

      expect(result).toEqual(input);
    });

    test('Given a nested object, When calling flattenObject, Then it should return an object with snake_case keys', () => {
      const input = {
        first: {
          name: 'John',
        },
        last: {
          name: 'Doe',
        },
        address: {
          street: '123 Main St',
          city: 'Los Angeles',
        },
      };

      const result = Flatty.flattenObject(input);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        address_street: '123 Main St',
        address_city: 'Los Angeles',
      });
    });

    test('Given an array of nested objects, When calling flattenObject, Then it should return an array of objects with snake_case keys', () => {
      const input = [
        {
          first: {
            name: 'John',
          },
          last: {
            name: 'Doe',
          },
        },
        {
          first: {
            name: 'Jane',
          },
          last: {
            name: 'Smith',
          },
          someProp: { ab: { c1: 'valor' }, ld: 'value' },
        },
      ];

      const result = Flatty.flattenObject(input);

      expect(result).toEqual([
        {
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          first_name: 'Jane',
          last_name: 'Smith',
          someProp_ab_c1: 'valor',
          someProp_ld: 'value',
        },
      ]);
    });
  });

  describe('unflattenObject', () => {
    test('Given an object with no nesting, When calling unflattenObject, Then it should return the same object', () => {
      const input = {
        name: 'John',
        age: 30,
        city: 'New York',
      };

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual(input);
    });

    test('Given an object with snake_case keys, When calling unflattenObject, Then it should return an object with nested properties', () => {
      const input = {
        first_name: 'John',
        last_name: 'Doe',
        address_street: '123 Main St',
        address_city: 'Los Angeles',
      };

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual({
        first: {
          name: 'John',
        },
        last: {
          name: 'Doe',
        },
        address: {
          street: '123 Main St',
          city: 'Los Angeles',
        },
      });
    });

    test('Given an array with snake_case keys, When calling unflattenObject, Then it should return an array with nested objects', () => {
      const input = [
        {
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          first_name: 'Jane',
          last_name: 'Smith',
        },
      ];

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual([
        {
          first: {
            name: 'John',
          },
          last: {
            name: 'Doe',
          },
        },
        {
          first: {
            name: 'Jane',
          },
          last: {
            name: 'Smith',
          },
        },
      ]);
    });

    test('Given an object with more than one snake_case keys, When calling unflattenObject, Then it should return an object with nested properties', () => {
      const input = {
        first_name: 'John',
        last_name: 'Doe',
        address_street: '123 Main St',
        address_city: 'Los Angeles',
        address_cep_value: '12345-678',
      };

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual({
        first: {
          name: 'John',
        },
        last: {
          name: 'Doe',
        },
        address: {
          street: '123 Main St',
          city: 'Los Angeles',
          cep: {
            value: '12345-678',
          },
        },
      });
    });

    test('Given an object with snake_case keys and arrays, When calling unflattenObject, Then it should return object and nested properties arrays unflatten', () => {
      const input = {
        name: 'John',
        age: 30,
        city: ['New York', 'Los Angeles'],
        childrens: [
          {
            name: 'Alice',
            dad_name: 'John',
          },
          {
            name: 'Bob',
            dad_name: 'John',
          },
        ],
        inventory: [
          ['item1', 'item2'],
          ['item3', 'item4'],
        ],
      };

      const expected = {
        name: 'John',
        age: 30,
        city: ['New York', 'Los Angeles'],
        childrens: [
          {
            name: 'Alice',
            dad: {
              name: 'John',
            },
          },
          {
            name: 'Bob',
            dad: {
              name: 'John',
            },
          },
        ],
        inventory: [
          ['item1', 'item2'],
          ['item3', 'item4'],
        ],
      };

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual(expected);
    });

    test('Given an object with snake_case keys with more 1 deep and arrays, When calling unflattenObject, Then it should return object and nested properties arrays unflatten', () => {
      const input = {
        name: 'John',
        age: 30,
        city: ['New York', 'Los Angeles'],
        children_name: 'Alice',
        children_inventory: [{ name: 'guitar', category_name: 'music' }],
      };

      const expected = {
        name: 'John',
        age: 30,
        city: ['New York', 'Los Angeles'],
        children: {
          name: 'Alice',
          inventory: [{ name: 'guitar', category: { name: 'music' } }],
        },
      };

      const result = Flatty.unflattenObject(input);

      expect(result).toEqual(expected);
    });
  });
});
