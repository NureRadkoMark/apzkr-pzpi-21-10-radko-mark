package com.example.apz_mobile.views

import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.apz_mobile.databinding.ActivityHomeBinding
import com.example.apz_mobile.network.ApiServiceInstance
import com.example.apz_mobile.network.UserRepository
import com.example.apz_mobile.viewmodels.UserViewModel
import com.example.apz_mobile.viewmodels.UserViewModelFactory
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import com.google.zxing.WriterException
import com.google.zxing.common.BitMatrix

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var viewModel: UserViewModel
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)

        viewModel = ViewModelProvider(this, UserViewModelFactory(UserRepository(ApiServiceInstance.apiService)))
            .get(UserViewModel::class.java)

        val iotCode = intent.getStringExtra("iotCode") ?: ""
        if (iotCode.isNotEmpty()) {
            Toast.makeText(this, "IOT Code: $iotCode", Toast.LENGTH_LONG).show()
        }

        val token = getAuthTokenFromSharedPreferences()

        if (token.isNotEmpty()) {
            viewModel.getUserDetails(token)
        } else {
            Toast.makeText(this, "Token is empty", Toast.LENGTH_SHORT).show()
        }

        setupButtonsBasedOnRole()

        observeViewModel()

        setupButtonClickListeners()
    }

    private fun observeViewModel() {

        viewModel.userDetailsResponse.observe(this, Observer { userDetails ->
            userDetails?.let {

                val userFullName = "${it.firstName} ${it.secondName}"
                val IoTCode = "${it.iotCode}"
                generateAndDisplayBarcode(IoTCode)
                Toast.makeText(this, "User details: $userFullName", Toast.LENGTH_LONG).show()

            }
        })


        viewModel.error.observe(this, Observer { errorMessage ->
            errorMessage?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun generateAndDisplayBarcode(iotCode: String) {
        try {

            val bitmap = encodeAsBitmap(iotCode, BarcodeFormat.CODE_128, 600, 300)

            binding.imageViewBarcode.setImageBitmap(bitmap)
            binding.textViewCode.text = iotCode
        } catch (e: WriterException) {
            e.printStackTrace()
        }
    }

    @Throws(WriterException::class)
    private fun encodeAsBitmap(contents: String, format: BarcodeFormat, width: Int, height: Int): Bitmap? {
        val multiFormatWriter = MultiFormatWriter()
        val bitMatrix: BitMatrix = multiFormatWriter.encode(contents, format, width, height)
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

        for (x in 0 until width) {
            for (y in 0 until height) {
                bitmap.setPixel(x, y, if (bitMatrix[x, y]) 0xFF000000.toInt() else 0xFFFFFFFF.toInt())
            }
        }

        return bitmap
    }

    private fun getAuthTokenFromSharedPreferences(): String {
        return sharedPreferences.getString("jwtToken", "") ?: ""
    }

    private fun setupButtonsBasedOnRole() {
        val role = getUserRoleFromLocalStorage()

        when (role) {
            "Client" -> setupClientButtons()
            "Doctor" -> setupDoctorButtons()
            else -> setupDefaultButtons()
        }
    }

    private fun getUserRoleFromLocalStorage(): String {

        return "Client"
    }

    private fun setupClientButtons() {
        binding.buttonProfile.visibility = Button.VISIBLE
        binding.buttonAppointment.visibility = Button.VISIBLE
        binding.buttonMyAppointments.visibility = Button.VISIBLE
        binding.buttonMyPets.visibility = Button.VISIBLE
        binding.buttonMyCalendar.visibility = Button.GONE
    }

    private fun setupDoctorButtons() {
        binding.buttonProfile.visibility = Button.VISIBLE
        binding.buttonAppointment.visibility = Button.GONE
        binding.buttonMyAppointments.visibility = Button.GONE
        binding.buttonMyPets.visibility = Button.GONE
        binding.buttonMyCalendar.visibility = Button.VISIBLE
    }

    private fun setupDefaultButtons() {
        binding.buttonProfile.visibility = Button.VISIBLE
        binding.buttonAppointment.visibility = Button.VISIBLE
        binding.buttonMyAppointments.visibility = Button.VISIBLE
        binding.buttonMyPets.visibility = Button.VISIBLE
        binding.buttonMyCalendar.visibility = Button.VISIBLE
    }

    private fun setupButtonClickListeners() {
        binding.buttonProfile.setOnClickListener {
            Toast.makeText(this, "Профіль", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
            finish()
        }
        binding.buttonAppointment.setOnClickListener {
            Toast.makeText(this, "Запис до лікаря", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, AppointmentActivity::class.java)
            startActivity(intent)
            finish()
        }
        binding.buttonMyAppointments.setOnClickListener {
            Toast.makeText(this, "Мої записи", Toast.LENGTH_SHORT).show()
        }
        binding.buttonMyPets.setOnClickListener {
            Toast.makeText(this, "Мої улюбленці", Toast.LENGTH_SHORT).show()
        }
        binding.buttonMyCalendar.setOnClickListener {
            Toast.makeText(this, "Мій розклад", Toast.LENGTH_SHORT).show()
        }

        binding.buttonLogout.setOnClickListener {
            logout()
        }
    }

    private fun logout() {
        Toast.makeText(this, "Logout clicked", Toast.LENGTH_SHORT).show()
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}






