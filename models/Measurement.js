const supabase = require("../helpers/supabase");

class Measurement {
  static async create(measurementData) {
    const { data, error } = await supabase
      .from("measurements")
      .insert([
        {
          user_id: measurementData.userId,
          decibels: measurementData.decibels,
          latitude: measurementData.latitude,
          longitude: measurementData.longitude,
          location_name: measurementData.locationName,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async findByUserId(userId, limit = 100) {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async findAll(limit = 100) {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, measurementData) {
    const updateData = {};

    if (measurementData.decibels !== undefined) {
      updateData.decibels = measurementData.decibels;
    }
    if (measurementData.latitude !== undefined) {
      updateData.latitude = measurementData.latitude;
    }
    if (measurementData.longitude !== undefined) {
      updateData.longitude = measurementData.longitude;
    }
    if (measurementData.locationName !== undefined) {
      updateData.location_name = measurementData.locationName;
    }

    const { data, error } = await supabase
      .from("measurements")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from("measurements")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
}

module.exports = Measurement;
