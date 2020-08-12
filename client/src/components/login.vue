<template>
  <div class="login">
    <div class="col" v-show="step <= 1">
      <div class="qrcode">
        <h1>Your code</h1>
        <div class="qrcode-image">
          <img
            :src="'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + token"
            alt="Token"
          >
        </div>
      </div>
    </div>
    <div class="col">
      <div class="scan">
        <div v-show="step === 0">
          <h1>Scan code</h1>
          <div class="btn-group">
            <a
              class="btn"
              @click.prevent="fileUpload.click()"
            >
              <i class="fas fa-upload" />
              Upload image
            </a>
            <a
              class="btn"
              @click.prevent="requestCamera()"
            >
              <i class="fas fa-camera" />
              Scan QR-code
            </a>
          </div>
        </div>

        <div v-show="step === 1">
          <h1>Select camera</h1>

          <select
            v-model="camera"
            class="camera-picker"
          >
            <option
              v-for="camera in cameras"
              :key="camera.id"
              :value="camera.id"
            >
              {{ camera.label || camera.id }}
            </option>
          </select>
        </div>

        <div v-show="step === 2">
          <h1>Scan code</h1>

          <div
            id="reader"
            style="width: 500px"
          />

          <div class="center mt-1">
            <div
              class="btn btn-sm"
              @click.prevent="reset()"
            >
              <i class="fas fa-window-close" />
              Annuleren
            </div>
          </div>
        </div>

        <input
          ref="fileUpload"
          class="hidden"
          type="file"
          @change="handleFile"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Html5Qrcode } from "@/utils/qrcode-scanner.js";
import { Ref, Watch } from "vue-property-decorator";

type Camera = {
  id: string;
  label: string;
};

@Component
export default class TypingBar extends Vue {
  @Ref() fileUpload: HTMLInputElement;
  private qrcode: Html5Qrcode;
  private cameras: Camera[] = [];
  private camera: string = null;

  isScanning = false;
  token: string = null;
  step = 0;

  mounted() {
      this.token = localStorage.getItem("token");
      this.qrcode = new Html5Qrcode("reader", false);
  }

  async handleFile(e: { target: HTMLInputElement }) {
    const { files } = e.target;

    if (files.length == 0) {
      return;
    }

    try {
      this.setToken(await this.qrcode.scanFile(files[0], false));
    } catch {
      // TODO: Error.
    }
  }

  async requestCamera() {
    try {
      this.cameras = await Html5Qrcode.getCameras();

      if (this.cameras.length === 0) {
        this.step = 0;
      } else if (this.cameras.length === 1) {
        this.camera = this.cameras[0].id;
      } else {
        this.step = 1;
      }
    } catch(e) {
      this.step = 0;
    }
  }

  @Watch("camera")
  async startCamera() {
    if (!this.camera) {
      return;
    }

    try {
      this.step = 2;

      this.$nextTick(async () => {
        try {
          this.isScanning = true;

          await this.qrcode.start(
            this.camera,
            { fps: 10, qrbox: 250 },
            async (result: string) => {
              this.setToken(result);
              await this.reset();
            },
            () => {
              // ignore
            })
        } catch {
          this.isScanning = false;
          this.step = 0;
        }
      })
    } catch {
      this.isScanning = false;
      this.step = 0;
    }
  }

  async reset() {
    if (this.isScanning) {
      await this.qrcode.stop();
    }

    this.camera = null;
    this.isScanning = false;
    this.step = 0;
    this.qrcode = new Html5Qrcode("reader", false);
  }

  setToken(input: string) {
    localStorage.setItem("token", input);
    location.reload(); // TODO: Improve this
  }
}
</script>
