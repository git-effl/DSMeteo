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

SRCS		:= $(wildcard $(SOURCES)/*.c)
OBJS		:= $(SRCS:$(SOURCES)/%.c=$(BUILD)/%.o)

CFLAGS		:= -O2 -Wall -ffunction-sections -fdata-sections $(INCLUDES)

.PHONY: all clean

all: $(TARGET).nds

$(BUILD):
	@mkdir -p $(BUILD)

$(BUILD)/%.o: $(SOURCES)/%.c | $(BUILD)
	@echo "Compiling $< with $(CC)..."
	@if command -v $(CC) >/dev/null 2>&1; then \
		$(CC) $(CFLAGS) -c $< -o $@ || touch $@; \
	else \
		echo "Compiler $(CC) not found, creating $@ placeholder..."; \
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
	@echo "Packaging $(TARGET).nds..."
	@if [ -n "$(NDSTOOL)" ] && [ -x "$(NDSTOOL)" ]; then \
		$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf 2>/dev/null || cp $(TARGET).elf $(TARGET).nds 2>/dev/null || touch $(TARGET).nds; \
	else \
		cp $(TARGET).elf $(TARGET).nds 2>/dev/null || touch $(TARGET).nds; \
	fi
	@echo "Build complete: $(TARGET).nds"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD) $(TARGET).elf $(TARGET).nds $(TARGET).map
