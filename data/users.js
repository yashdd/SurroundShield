import express from "express";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createUser = async (name, email, password, age, height, weight, bmi, lat, lon) => {
    try {
        const userCollection = await users();
        const user = await userCollection.insertOne({ name, email, password, age, height, weight, bmi, lat, lon });
        return user;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const getUser = async (id) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        return user;
    } catch (e) {
        throw e;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        return user;
    } catch (e) {
        throw e;
    }
};

export const updateUser = async (id, name, age, height, weight, bmi, lat, lon) => {
    try {
        const userCollection = await users();
        const user = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: { name, age, height, weight, bmi, lat, lon } });
        return user;
    } catch (e) {
        throw e;
    }
};

export const deleteUser = async (id) => {
    try {
        const userCollection = await users();
        const user = await userCollection.deleteOne({ _id: new ObjectId(id) });
        return user;
    } catch (e) {
        throw e;
    }
};






