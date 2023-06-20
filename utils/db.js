import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("user_lemon");

export async function createUserTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `create table if not exists user 
          (id integer primary key not null, 
            firstname text DEFAULT '', lastname text DEFAULT '', email text DEFAULT '', 
            phone text,orderstatus integer DEFAULT 0,passwordchange integer DEFAULT 0,
            specialoffer integer DEFAULT 0, newsletter integer DEFAULT 0, avatar text
          );`
        );
      },
      reject,
      resolve
    );
  });
}

/**
 *
 * @returns []data or false
 */
export async function getUserData() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * from user", [], (_, { rows }) => {
        resolve(rows._array.length > 0 ? rows._array[0] : false);
      });
    });
  });
}

/**
 * updates user data
 * {firstname:?, lastname:?,email:?,phone:?,
 * orderstatus:?,passwordchange:?,specialoffer:?,
 * newsletter:?, avatar:?}
 * @param {*} params
 */
export async function updateUserData(params = {}) {
  db.transaction((tx) => {
    const query = `UPDATE user SET firstname='${params.firstname}', lastname='${params.lastname}',
    email='${params.email}',phone='${params.phone}', orderstatus='${params.orderstatus}',
    passwordchange='${params.passwordchange}',specialoffer='${params.specialoffer}',
    newsletter='${params.newsletter}', avatar='${params.avatar}' WHERE id=1`;

    tx.executeSql(
      query,
      [],
      (_, { rows }) => {
        // console.log(rows._array);
      },
      (_, err) => {
        throw new Error(`Something went wrong, stack info : ${err}`);
      }
    );
  });
}

/**
 * saves user data
 * param spect an object
 * {firstname:?, lastname:?,email:?,phone:?,orderstatus:?,passwordchange:?,specialoffer:?,newsletter:?}
 */
export async function saveUserData(params = {}) {
  db.transaction((tx) => {
    const query = `insert into user (firstname , lastname , email, 
        phone,orderstatus,passwordchange , specialoffer, newsletter) values 
        ('${params.firstname}', '${params.lastname}', '${params.email}', 
         '${params.phone}', '${params.orderstatus}', '${params.passwordchange}',
         '${params.specialoffer}', '${params.newsletter}'
        )`;
    tx.executeSql(
      query,
      [],
      (_, { rows }) => {
        // console.log(rows._array);
      },
      (_, err) => {
        throw new Error(`Something went wrong, stack info : ${err}`);
      }
    );
  });
}

export async function deleteUser(params = {}) {
  db.transaction((tx) => {
    tx.executeSql(
      // "DROP TABLE user",
      'DELETE FROM user',
      [],
      (_, { rows }) => {
        // console.log(rows._array);
      },
      (_, err) => {
        throw new Error(`Something went wrong, stack info : ${err}`);
      }
    );
  });
}