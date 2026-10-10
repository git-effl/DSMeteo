# SPDX-License-Identifier: CC0-1.0
#
# Makefile for DSMeteo - Nintendo DS / Nintendo DSi Weather Application

BLOCKSDS ?= /opt/blocksds/core

# User-defined values
# ===================

GAME_TITLE := DSMeteo
GAME_SUBTITLE := The Weather, On your Nintendo DS
GAME_AUTHOR := effL
GAME_ICON :=icon.bmp

# Source code paths
# =================

SOURCEDIRS := source
INCLUDEDIRS := source

# Custom libraries
# ================

LIBS := -lnds9

# Check if official BlocksDS build system is present
ifneq ($(wildcard $(BLOCKSDS)/sys/default_makefiles/rom_arm9/Makefile),)
    # Use official BlocksDS ARM9 + ARM7 ROM build rules
    include $(BLOCKSDS)/sys/default_makefiles/rom_arm9/Makefile
else
    # Standalone build rules
    TARGET   := DSMeteo
    BUILD    := build
    SOURCES  := source
    INCLUDES := -I$(SOURCES)

    CC       := $(firstword \
        $(wildcard /opt/wonderful/toolchain/gcc-arm-none-eabi/bin/arm-none-eabi-gcc) \
        $(wildcard /opt/wonderful/bin/arm-none-eabi-gcc) \
        $(wildcard /opt/devkitpro/devkitARM/bin/arm-none-eabi-gcc) \
        $(shell which arm-none-eabi-gcc 2>/dev/null) \
        gcc)

    NDSTOOL  := $(firstword \
        $(wildcard /opt/blocksds/core/tools/ndstool/ndstool) \
        $(wildcard /opt/wonderful/bin/ndstool) \
        $(wildcard /opt/devkitpro/tools/bin/ndstool) \
        $(shell which ndstool 2>/dev/null))

    ARM7_BIN := $(firstword $(wildcard \
        /opt/blocksds/core/sys/arm7/dswifi_arm7.elf \
        /opt/blocksds/core/sys/arm7/arm7.elf \
        /opt/devkitpro/libnds/default.arm7.flp))

    SRCS := $(wildcard $(SOURCES)/*.c)
    OBJS := $(SRCS:$(SOURCES)/%.c=$(BUILD)/%.o)

    CFLAGS := -O2 -Wall $(INCLUDES)

    .PHONY: all clean

    all: $(TARGET).nds

    $(BUILD):
		@mkdir -p $(BUILD)

    $(BUILD)/%.o: $(SOURCES)/%.c | $(BUILD)
		@$(CC) $(CFLAGS) -c $< -o $@

    $(TARGET).elf: $(OBJS)
		@$(CC) $(OBJS) -o $@

    $(TARGET).nds: $(TARGET).elf
		@if [ -n "$(NDSTOOL)" ] && [ -x "$(NDSTOOL)" ]; then \
			if [ -n "$(ARM7_BIN)" ]; then \
				$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf -7 $(ARM7_BIN) -b "" "DSMETEO;The Weather;Gemini"; \
			else \
				$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf -b "" "DSMETEO;The Weather;Gemini"; \
			fi \
		else \
			cp $(TARGET).elf $(TARGET).nds; \
		fi

    clean:
		@rm -rf $(BUILD) $(TARGET).elf $(TARGET).nds $(TARGET).map
endif
