import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import controllers from '../src/controllers';
import { Hobby, User } from '../src/models';

let memoryServer: MongoMemoryServer;

async function flushDB () {
  const collections = mongoose.connection.collections;
  const promises = [];
  for (const key in collections) {
    const collection = collections[key];
    promises.push(collection.deleteMany({}));
  }
  await Promise.all(promises);
};

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create();
  const dbUri = memoryServer.getUri();
  await mongoose.connect(dbUri, { dbName: 'hobbies' });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await memoryServer.stop();
});

describe('createUser', () => {
  beforeAll(async () => { await flushDB() });
  it('should create a new user instance', async () => {
    const data = { name: 'MlkMahmud' };
    await controllers.createUser(data);
    const user = await User.findOne({ name: data.name });
    expect(user).not.toBeNull();
    expect(user).toHaveProperty('name', data.name);
  });

  it('should throw an error if the name is already taken', async () => {
    try {
      const data = { name: 'MlkMahmud' };
      await controllers.createUser(data);
    } catch (e) {
      expect(e).toHaveProperty('message', 'This name is already taken');
    }
  });

  it('should create a new user instance', async () => {
    const data = { name: 'Batman' };
    await controllers.createUser(data);
    const user = await User.findOne({ name: data.name });
    expect(user).not.toBeNull();
    expect(user).toHaveProperty('name', data.name);
  });

  it('should throw an error if the name is already taken', async () => {
    try {
      const data = { name: 'Batman' };
      await controllers.createUser(data);
    } catch (e) {
      expect(e).toHaveProperty('message', 'This name is already taken');
    }
  });

  it('should throw an error if a name is not provided', async () => {
    const data = {};
    try {
      await controllers.createUser(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" is required');
    }
  });

  it('should throw an error if name is invalid', async () => {
    try {
      const data = { name: null };
      await controllers.createUser(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" must be a string');
    }
  });

  it('should throw an error if name is invalid', async () => {
    try {
      const data = { name: 10 };
      await controllers.createUser(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" must be a string');
    }
  });

  it('should throw an error if name is invalid', async () => {
    try {
      const data = { name: {} }
      await controllers.createUser(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" must be a string');
    }
  });
});

describe('getAllUsers', () => {
  beforeAll(async () => { await flushDB() });

  it('should return an empty array if there are no users', async () => {
    const users = await controllers.getAllUsers();
    expect(users).toEqual([]);
  });

  it('should return all users in the database', async () => {
    const names = ['Emma', 'Senku', 'Takemichi', 'Tanjiro'];
    await User.create(names.map((name) => ({ name })));
    const users = await controllers.getAllUsers();
    expect(users).toHaveLength(names.length);
    users.forEach((user) => {
      expect(names).toContain(user.name);
    })
  });
});

describe('createHobbies', () => {
  let userId: string;
  beforeAll(async () => {
    await flushDB();
    const user = await User.create({ name: 'Neji' });
    userId = user._id.toString();
  });

  it('should create hobbies for a given user', async () => {
    const data = { name: 'Reading', year: 2005, passionLevel: 'High', userId };
    const hobby = await controllers.createHobby(data);
    expect(hobby).toHaveProperty('name', data.name);
    expect(hobby).toHaveProperty('year', data.year);
    expect(hobby).toHaveProperty('passionLevel', data.passionLevel);
  });

  it('should set a default value for hobby year', async () => {
    const data = { name: 'Basketball', passionLevel: 'High', userId };
    const currentYear = new Date().getFullYear();
    const hobby = await controllers.createHobby(data);
    expect(hobby).toHaveProperty('name', data.name);
    expect(hobby).toHaveProperty('year', currentYear);
    expect(hobby).toHaveProperty('passionLevel', data.passionLevel);
  });

  it('should set a default value for hobby passionLevel', async () => {
    const data = { name: 'Basketball', year: 2004, userId };
    const defualtPassionLevel = 'Low';
    const hobby = await controllers.createHobby(data);
    expect(hobby).toHaveProperty('name', data.name);
    expect(hobby).toHaveProperty('year', data.year);
    expect(hobby).toHaveProperty('passionLevel', defualtPassionLevel);
  });

  it('should set throw an error if a name is not provided', async () => {
    try {
      const data = { userId, passionLevel: 'High', year: 2004 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" is required');
    }
  });

  it('should set throw an error if a name is invalid', async () => {
    try {
      const data = { name: 4, userId, passionLevel: 'High', year: 2004 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" must be a string');
    }
  });

  it('should set throw an error if a name is invalid', async () => {
    try {
      const data = { name: null, userId, passionLevel: 'High', year: 2004 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"name" must be a string');
    }
  });

  it('should set throw an error if a year is invalid', async () => {
    try {
      const data = { name: 'Running', userId, passionLevel: 'High', year: '30BC' };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"year" must be a number');
    }
  });

  it('should set throw an error if a year is invalid', async () => {
    try {
      const data = { name: 'Running', userId, passionLevel: 'High', year: 0 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"year" must be greater than or equal to 1990');
    }
  });

  it('should set throw an error if a year is invalid', async () => {
    const currentYear = new Date().getFullYear();
    try {
      const futureYear = currentYear + 1;
      const data = { name: 'Running', userId, passionLevel: 'High', year: futureYear };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', `"year" must be less than or equal to ${currentYear}`);
    }
  });

  it('should throw an error if passionLevel is invalid', async () => {
    try {
      const data = { name: 'Running', userId, passionLevel: 'Super-High', year: 2004 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"passionLevel" must be one of [Low, Medium, High, Very-High]');
    }
  });

  it('should throw an error if passionLevel is invalid', async () => {
    try {
      const data = { name: 'Running', userId, passionLevel: 20, year: 2004 };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', '"passionLevel" must be one of [Low, Medium, High, Very-High]');
    }
  });

  it('should throw an error if userId is not a valid objectId', async () => {
    try {
      const data = { name: 'Running', userId: '12345' };
      await controllers.createHobby(data as any);
    } catch (e) {
      expect(e).toHaveProperty('message', 'user id is invalid');
    }
  });
});

describe('getHobbies', () => {
  let userId: string;
  beforeAll(async () => {
    await flushDB();
    const user = await User.create({ name: 'Neji' });
    userId = user._id.toString();
  });

  it('should return an empty array if user has no hobbies', async () => {
    const hobbies = await controllers.getHobbies(userId);
    expect(hobbies).toEqual([]);
  });

  it('should return all hobbies belonging to a user', async () => {
    const names = ['Running', 'Basketball', 'Anime', 'Video Games'];
    await Hobby.create(names.map((name) => ({ name, userId })));
    const hobbies = await controllers.getHobbies(userId);
    expect(hobbies).toHaveLength(names.length);
    hobbies.forEach((hobby) => {
      expect(hobby.userId.toString()).toEqual(userId);
      expect(names).toContain(hobby.name);
    })
  });
});

describe('deleteHobby', () => {
  let userId: string;
  const names = ['Running', 'Basketball', 'Anime', 'Video Games'];
  beforeAll(async () => {
    await flushDB();
    const user = await User.create({ name: 'Neji' });
    userId = user._id.toString();
    await Hobby.create(names.map((name) => ({ name, userId })));
  });

  it('should delete the selected hobby', async () => {
    const name = 'Running';
    const { _id } = await Hobby.findOne({ userId, name });
    await controllers.deleteHobby(_id.toString(), userId);
    const hobbies = await Hobby.find({ userId });
    expect(hobbies).toHaveLength(names.length - 1);
    hobbies.forEach((hobby) => {
      expect(hobby).not.toEqual(name);
    })
  });

  it('should delete the selected hobby', async () => {
    const name = 'Basketball';
    const { _id } = await Hobby.findOne({ userId, name });
    await controllers.deleteHobby(_id.toString(), userId);
    const hobbies = await Hobby.find({ userId });
    expect(hobbies).toHaveLength(names.length - 2);
    hobbies.forEach((hobby) => {
      expect(hobby).not.toEqual(name);
    })
  });

  it('should delete the selected hobby', async () => {
    const name = 'Anime';
    const { _id } = await Hobby.findOne({ userId, name });
    await controllers.deleteHobby(_id.toString(), userId);
    const hobbies = await Hobby.find({ userId });
    expect(hobbies).toHaveLength(names.length - 3);
    hobbies.forEach((hobby) => {
      expect(hobby).not.toEqual(name);
    })
  });

  it('should delete the selected hobby', async () => {
    const name = 'Video Games';
    const { _id } = await Hobby.findOne({ userId, name });
    await controllers.deleteHobby(_id.toString(), userId);
    const hobbies = await Hobby.find({ userId });
    expect(hobbies).toHaveLength(names.length - 4);
    hobbies.forEach((hobby) => {
      expect(hobby).not.toEqual(name);
    })
  });
});
