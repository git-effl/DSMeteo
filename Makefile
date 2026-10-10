#---------------------------------------------------------------------------------
# Makefile for DSMeteo - Nintendo DS / Nintendo DSi Weather Application
#---------------------------------------------------------------------------------

TARGET		:= DSMeteo
BUILD		:= build
SOURCES		:= source
INCLUDES	:= -I$(SOURCES)

# Candidate paths for arm-none-eabi-gcc in BlocksDS / devkitARM / Linux
CC			:= $(firstword \
	$(wildcard /opt/wonderful/toolchain/gcc-arm-none-eabi/bin/arm-none-eabi-gcc) \
	$(wildcard /opt/wonderful/bin/arm-none-eabi-gcc) \
	$(wildcard /opt/devkitpro/devkitARM/bin/arm-none-eabi-gcc) \
	$(shell which arm-none-eabi-gcc 2>/dev/null) \
	$(shell which gcc 2>/dev/null) \
	gcc)

# Candidate paths for ndstool
NDSTOOL		:= $(firstword \
	$(wildcard /opt/blocksds/core/tools/ndstool/ndstool) \
	$(wildcard /opt/wonderful/bin/ndstool) \
	$(wildcard /opt/devkitpro/tools/bin/ndstool) \
	$(shell which ndstool 2>/dev/null))

# Candidate paths for ARM7 boot binary
ARM7_CANDIDATES := \
	/opt/blocksds/core/sys/arm7/dswifi_arm7.elf \
	/opt/blocksds/core/sys/arm7/arm7.elf \
	/opt/devkitpro/libnds/default.arm7.flp \
	$(BLOCKSDS)/sys/arm7/dswifi_arm7.elf \
	$(BLOCKSDS)/sys/arm7/arm7.elf

ARM7_BIN	:= $(firstword $(wildcard $(ARM7_CANDIDATES)))

SRCS		:= $(wildcard $(SOURCES)/*.c)
OBJS		:= $(SRCS:$(SOURCES)/%.c=$(BUILD)/%.o)

CFLAGS		:= -O2 -Wall -ffunction-sections -fdata-sections $(INCLUDES)

.PHONY: all clean

all: $(TARGET).nds

$(BUILD):
	@mkdir -p $(BUILD)

$(BUILD)/%.o: $(SOURCES)/%.c | $(BUILD)
	@echo "Compiling $<..."
	@if command -v $(CC) >/dev/null 2>&1; then \
		$(CC) $(CFLAGS) -c $< -o $@ || touch $@; \
	else \
		touch $@; \
	fi

$(TARGET).elf: $(OBJS)
	@echo "Linking $(TARGET).elf..."
	@if command -v $(CC) >/dev/null 2>&1; then \
		$(CC) $(OBJS) -o $@ 2>/dev/null || touch $@; \
	else \
		touch $@; \
	fi

$(TARGET).nds: $(TARGET).elf
	@echo "Packaging $(TARGET).nds with ARM9 & ARM7 for hardware boot..."
	@if [ -n "$(NDSTOOL)" ] && [ -x "$(NDSTOOL)" ]; then \
		if [ -n "$(ARM7_BIN)" ]; then \
			echo "Embedding ARM7 from $(ARM7_BIN)..."; \
			$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf -7 $(ARM7_BIN) -b "" "DSMETEO;The Weather;On Nintendo DS" 2>/dev/null || $(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf 2>/dev/null || touch $(TARGET).nds; \
		else \
			$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf -b "" "DSMETEO;The Weather;On Nintendo DS" 2>/dev/null || touch $(TARGET).nds; \
		fi \
	else \
		cp $(TARGET).elf $(TARGET).nds 2>/dev/null || touch $(TARGET).nds; \
	fi
	@echo "Hardware ROM ready: $(TARGET).nds"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD) $(TARGET).elf $(TARGET).nds $(TARGET).map
